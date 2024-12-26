'use strict';
// import './middleware/sentry.js'; // Sentry instrumentation
// logs, monitoring, etc
import * as Sentry from '@sentry/node';
// import pinoHttp from 'pino-http';
import getLogger, { getStream } from './utilities/logger.js';
import chalk from 'chalk';
//dependencies
// import dotenv from 'dotenv';
import express from 'express';
import { CronJob } from 'cron';

// documentation
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
// middleware
import performanceMiddleware from './middleware/performance.js';
import umamiMiddleware from './middleware/umami.js';
// utils
import configureDB from './utilities/configureDB.js';
import fetchCampaignStatus from './utilities/fetchCampaignStatus.js';
import updateApiData from './utilities/updateApiData.js';
// routes
import rebroadcastRoute from './routes/v1/rebroadcast.js';
import defendRoute from './routes/v1/defend.js';

// INITIALIZE AND CONFIGURE APPLICATION
const log = getLogger();
log.info('Initializing application...');

const app = express(); // create an express instance
const port = 3000;
Sentry.setupExpressErrorHandler(app);
app.use(express.static('public')); // set the static files location to /public, so a reference to /img/logo.png will load /public/img/logo.png
app.set('view engine', 'pug'); // set the view engine to pug

// MIDDLEWARE
// app.use(performanceMiddleware); // performance middleware
// app.use(umamiMiddleware); // umami middleware
// app.use(pinoHttp(getStream())); // pino-http logging middleware
// DOCUMENTATION
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Helldivers I',
        version: '0.1.0',
        description: 'A description of your API',
    },
    servers: [
        {
            url: 'https://api.helldivers.bot',
            description: 'Production server',
        },
        {
            url: 'http://127.0.0.1:3000',
            description: 'Local Development server',
        },
    ],
    tags: [
        {
            name: 'API',
            description: 'API related endpoints',
        },
        {
            name: 'HTML',
            description: 'HTML related endpoints',
        },
    ],
};
const swaggerOptions = {
    // Options for the swagger docs
    swaggerDefinition,
    // Path to the API docs
    apis: ['./routes/**/*.js'], // Adjust the path according to your project structure
};
const swaggerSpec = swaggerJsdoc(swaggerOptions); // Initialize swagger-jsdoc
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // create swagger route

// ROUTES - API
app.use(rebroadcastRoute); //v1/rebroadcast
app.use(defendRoute); //v1/defend

// ROUTES - HTML
app.get('/html-pug', (req, res) => {
    // res.send("Hello World!");
    res.render('index', { title: 'Hey', message: 'Hello there!' });
});
app.get('/v1/timestamps', async (req, res) => {
    //cursor based pagination: GET /users?cursor=1734728860&limit=10
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor || null;

    try {
        const users = await prisma.user.findMany({
            take: limit,
            skip: cursor ? 1 : 0, // Skip the cursor if provided
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { id: 'asc' },
        });

        const nextCursor =
            users.length === limit ? users[users.length - 1].id : null;

        res.json({
            data: users,
            meta: {
                nextCursor,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while fetching users.',
        });
    }
});

async function main() {
    await configureDB(); // check if WAL mode is enabled, and enable if not
    updateApiData();
    // start express server

    app.listen(port, () => {
        const getDataFromAPI = new CronJob(
            '* * * * *',
            () => {
                updateApiData();
            },
            null, // No onComplete function
            true, // Start the job right now)
            'Europe/Brussels' // Time zone);
        );

        log.info(
            'APP - Express is running on ' +
                chalk.yellow.underline.underline('http://127.0.0.1:' + port)
        );
        log.info(
            'APP - Swagger docs are available at ' +
                chalk.yellow.underline.underline(
                    'http://127.0.0.1:' + port + '/docs'
                )
        );
    });
}

main().catch((error) => {
    log.error('Failed to start server:', error);
    prisma.$disconnect();
});
