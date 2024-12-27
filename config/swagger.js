export function swaggerDefinition() {
    const environment = process.env.NODE_ENV || 'development';
    let server = {};

    if (environment === 'production') {
        server = {
            url: 'https://api.helldivers.bot',
            description: 'Production server',
        };
    }
    if (environment === 'development') {
        server = {
            url: 'http://127.0.0.1:3000',
            description: 'Local Development server',
        };
    }

    return {
        openapi: '3.0.0',
        info: {
            title: 'Helldivers I',
            version: process.env.npm_package_version,
            description:
                "This serves as a cache for the official Helldivers' API to prevent overload and stores historical campaign data for statistics and predictions",
        },
        servers: [server],
        tags: [
            {
                name: 'API',
                description: 'API related endpoints',
            },
            {
                name: 'HTML',
                description: 'HTML related endpoints',
            },
            {
                name: 'Cursors',
                description:
                    'Historic data that supports cursor-based pagination',
            },
        ],
    };
}

export function swaggerRoutes() {
    const routes = ['./routes/**/*.js'];
    return routes;
}

export function swaggerOptions() {
    const definition = swaggerDefinition();
    const routes = swaggerRoutes();
    return {
        definition, // Options for the swagger docs
        apis: routes, // Paths containing docs, adjust the path according to your project structure
    };
}
