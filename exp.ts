import { Routing } from "./src";
import { createServer, IncomingMessage, ServerResponse } from "http";

let routing = new Routing(createServer().listen(8000))

routing.template = '<h1>Page Not Found</h1>';

routing
  .get('/', (req: IncomingMessage, res: ServerResponse) => res.end('Hello World!'))
  .get('/page', (req: IncomingMessage, res: ServerResponse) => res.end('Another Page'))

  