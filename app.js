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
import { swaggerOptions } from './config/swagger.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
// middleware
import performanceMiddleware from './middleware/performance.js';
import umamiMiddleware from './middleware/umami.js';
// utils
import configureDB from './config/database.js';
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
const swaggerSpec = swaggerJsdoc(swaggerOptions()); // Initialize swagger-jsdoc
app.set('view engine', 'pug'); // set the view engine to pug

// MIDDLEWARE
app.use(performanceMiddleware); // performance middleware
app.use(express.static('public')); // set the static files location to /public, so a reference to /img/logo.png will load /public/img/logo.png
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // create swagger route

// ROUTES - API
app.use(rebroadcastRoute); //v1/rebroadcast
app.use(event); //v1/event
app.use(cursors); //v1/timestamps, v1/campaign, v1/defend, v1/attack, v1/statistics

// ROUTES - HTML
app.get('/html-pug', (req, res) => {
    res.render('index', { title: 'Hey', message: 'Hello there!' });
});

// ROUTES - REDIRECTS
app.get('/', (req, res) => {
    res.redirect('/docs');
});

async function main() {
    await configureDB(); // check if WAL mode is enabled, and enable if not

    // start express server
    app.listen(port, () => {
        const getDataFromAPI = new CronJob(
            '*/15 * * * * *',
            () => {
                updateApiData(); // Your function to update API data
            },
            null, // No onComplete function
            true, // Start the job right now)
            'Europe/Brussels' // Time zone);
        );

        log.info('APP - express is running');
        log.info(
            'APP - swagger documentation is available at ' +
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
