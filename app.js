'use strict';
// import './middleware/sentry.js'; // Sentry instrumentation
// logs, monitoring, etc
import * as Sentry from '@sentry/node';
import getLogger, { getStream } from './utilities/logger.js';
import chalk from 'chalk';
//dependencies
// import dotenv from 'dotenv';
import express from 'express';
import { CronJob } from 'cron';
import fs from 'fs';
import path from 'path';
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
import event from './routes/v1/event.js';
import cursors from './routes/v1/cursors.js';

// INITIALIZE AND CONFIGURE APPLICATION
const log = getLogger();
log.info('Initializing application...');

const app = express(); // create an express instance
const port = 3000;
Sentry.setupExpressErrorHandler(app);
app.use(express.static('public')); // set the static files location to /public, so a reference to /img/logo.png will load /public/img/logo.png
app.set('view engine', 'pug'); // set the view engine to pug

// MIDDLEWARE
app.use(performanceMiddleware); // performance middleware
// app.use(umamiMiddleware); // umami middleware
// DOCUMENTATION
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Helldivers I',
        version: '0.7.0',
        description: 'A description of your API',
    },
    servers: [
        {
            url: 'https://api.helldivers.bot',
            description: 'Production server',
        },
        // {
        //     url: 'http://127.0.0.1:3000',
        //     description: 'Local Development server',
        // },
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
        {
            name: 'Cursors',
            description: 'Historic data that supports cursor-based pagination',
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

// const swaggerTemplate = fs.readFileSync(
//     path.join('.', 'views', 'swagger.html'),
//     'utf-8'
// );
// app.use('/docs', swaggerUi.serve, (req, res, next) => {
//     res.send(swaggerTemplate);
// });

// ROUTES - API
app.use(rebroadcastRoute); //v1/rebroadcast
app.use(event); //v1/event
app.use(cursors); //v1/timestamps, v1/campaign, v1/defend, v1/attack, v1/statistics

// ROUTES - HTML
app.get('/html-pug', (req, res) => {
    // res.send("Hello World!");
    res.render('index', { title: 'Hey', message: 'Hello there!' });
});

async function main() {
    await configureDB(); // check if WAL mode is enabled, and enable if not
    // updateApiData();

    // start express server
    app.listen(port, () => {
        const getDataFromAPI = new CronJob(
            '* * * * *',
            () => {
                // Capture the start of the check-in
                const checkInId = Sentry.captureCheckIn(
                    {
                        monitorSlug: 'updateApiData',
                        status: 'in_progress',
                    },
                    {
                        schedule: {
                            type: 'crontab',
                            value: '* * * * *',
                        },
                        checkinMargin: 1,
                        maxRuntime: 1,
                        timezone: 'Europe/Brussels',
                    }
                );

                try {
                    updateApiData(); // Your function to update API data

                    // Capture the successful completion of the check-in
                    Sentry.captureCheckIn({
                        checkInId,
                        monitorSlug: 'updateApiData',
                        status: 'ok',
                    });
                } catch (error) {
                    // If there's an error, capture it and update the check-in status to 'error'
                    Sentry.captureException(error);

                    Sentry.captureCheckIn({
                        checkInId,
                        monitorSlug: 'updateApiData',
                        status: 'error',
                    });
                }
            },
            null, // No onComplete function
            true, // Start the job right now)
            'Europe/Brussels' // Time zone);
        );

        const CronJobWithCheckIn = Sentry.cron.instrumentCron(
            CronJob,
            'updateApiData'
        );

        const job = new CronJobWithCheckIn('* * * * *', () => {
            updateApiData();
        });

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
