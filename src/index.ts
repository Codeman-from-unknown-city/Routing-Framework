import { Server, IncomingMessage, ServerResponse } from "http";
import { DEFAULT_TEMPLATE } from "./template";

const METHODS: string[] = ['get', 'post', 'head', 'options', 'delete', 'put', 'connect', 'trace'];

type IHandler = <Req, Res>(requset: IncomingMessage | Req, response: ServerResponse | Res) => void;
type IAddHandler = (url: string, handler: IHandler) => Routing;
type IMethodHandlers = Map<string | RegExp, IHandler[]>;

export class Routing {
    template: string | Buffer
    get: IAddHandler
    post: IAddHandler
    head: IAddHandler
    options: IAddHandler
    delete: IAddHandler
    put: IAddHandler
    connect: IAddHandler
    trace: IAddHandler

    constructor(server: Server, template: string | Buffer = DEFAULT_TEMPLATE) {
        this._createRoutingStructure();
        this.template = template;

        server.on( 'request', this._findHandler.bind(this) );
    }

    private _createRoutingStructure = (): void => METHODS.forEach(method => {
        let propKey = `_${method}`;

        this[propKey] = new Map();
        this[method] = this._addHandler.bind(this, propKey);
    });
    
    private _addHandler(method: string, url: string | RegExp, handler: IHandler): this {
        let urlHandlers: IHandler[] = this._getUrlHandlers(method, url);
        urlHandlers.push(handler);

        this[method].set(url, urlHandlers);

        return this;
    }

    private _getUrlHandlers(method: string, url: string | RegExp): IHandler[] {
        let urlHandlers: IHandler[] | undefined = this[method].get(url);

        return urlHandlers ? urlHandlers : [];
    }

    private _sendNotFound(response: ServerResponse, method: string): void {
        response.statusCode = 404;
        response.statusMessage = 'Not Found';

        if (method === 'GET') {
            let errorPageTemplate: string | Buffer = this.template;

            response.setHeader('Content-Type', 'text/html; charset=utf-8');
            response.setHeader('Content-Lenght', errorPageTemplate.length);
            response.write(errorPageTemplate);
        }

        response.end();
    }

    private _findUrl(url: string, methodHandlers: IMethodHandlers): string | RegExp | undefined {
        let finder = (key: string | RegExp): boolean => key !== '/' && (key instanceof RegExp ? key.test(url) : url === key);

        return url === '/' ? '/' : Array.from( methodHandlers.keys() ).find(finder);
    }
    
    private _findHandler(request: IncomingMessage, response: ServerResponse): void {
        let { url, method } = request;

        let methodHandlers: IMethodHandlers | undefined = this[`_${method.toLowerCase()}`];
        if (methodHandlers.size === 0) {
            response.writeHead(405, 'Method Not Allowed').end();
            return;
        }

        let processedUrl: string | RegExp | undefined = this._findUrl(url, methodHandlers);
        if (!processedUrl) {
            this._sendNotFound(response, method);
            return;
        }

        let urlHandlers: IHandler[] = methodHandlers.get(processedUrl);
        urlHandlers.forEach(handler => handler(request, response));
    }
}
