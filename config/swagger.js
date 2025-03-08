import swaggerJsdoc from 'swagger-jsdoc';

function swaggerDefinition() {
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
                "This serves as a (3rd party) cache and historic data store for the official Helldivers' API to prevent overload.",
        },
        servers: [server],
        tags: [
            {
                name: 'Rebroadcast',
                description:
                    'A drop in replacement for the official API that mimics its behavior and returns the same data.',
            },
            {
                name: 'Bot',
                description:
                    'Special endpoints used by the helldivers discord bot',
            },
            {
                name: 'Cursors',
                description:
                    'Historic data that supports cursor-based pagination',
            },
            {
                name: 'Data',
                description: '(TODO) File and HTML related endpoints',
            },
        ],
    };
}

function swaggerRoutes() {
    const routes = ['./routes/**/*.js'];
    return routes;
}

function swaggerDocument() {
    const definition = swaggerDefinition();
    const routes = swaggerRoutes();

    return {
        definition, // Options for the swagger docs
        apis: routes, // Paths containing docs, adjust the path according to your project structure
    };
}

function options() {
    return {
        explorer: true,
        customJs: '/js/swaggerTracking.js',
    };
}

const swaggerSpec = swaggerJsdoc(swaggerDocument()); // Initialize swagger-jsdoc
const swaggerOptions = options();

export { swaggerSpec, swaggerOptions };
