export const DEFAULT_TEMPLATE: string =  `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404</title>
</head>
<body>
    <style>
        .main {
            margin-top: 15%;
            text-align: center;
        }

        .arrow {
            font-size: 35px;
        }

        .link {
            color: #e53935;
            text-decoration: none;
        }
    </style>
    <div class="main">
        <h1>404 Page Not Found</h1>
        <a href="/" class="link">
            <h2><span class="arrow">&#8592;</span>Return to the homepage</h2>
        </a>
    </div>
</body>
</html>
`
