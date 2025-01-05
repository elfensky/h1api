'use strict';
// logs, monitoring, etc
import * as Sentry from '@sentry/node';
import { getLogger, getStream } from './utilities/loggers.js';
import chalk from 'chalk';
//dependencies
import express from 'express';
import prisma from './prisma/prisma.js';
import { CronJob } from 'cron';
import path from 'path';
import fs from 'fs';
// documentation
import { swaggerOptions } from './config/swagger.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
// middleware
import performanceMiddleware from './middleware/performance.js';
import umamiMiddleware from './middleware/umami.js';
// utils
import configureDB from './config/configureDB.js';
import configureDATA from './config/configureDATA.js';
//db
import getActiveSeason from './prisma/func/getActiveSeason.js';
// updates
import updateStatus from './auto/updateStatus.js';
import updateSeason from './auto/updateSeason.js';
// routes
import rebroadcastRouter from './routes/api/rebroadcast.js';
import botRouter from './routes/api/bot.js';
import cursorRouter from './routes/api/cursor.js';

// INITIALIZE AND CONFIGURE APPLICATION
const log = getLogger();
log.info('Initializing application...');
const app = express(); // create an express instance
const port = 3000;
Sentry.setupExpressErrorHandler(app);
app.set('view engine', 'pug'); // set the view engine to pug
const swaggerSpec = swaggerJsdoc(swaggerOptions()); // Initialize swagger-jsdoc
const release = 'helldivers1api@' + process.env.npm_package_version;

// MIDDLEWARE
app.use(performanceMiddleware); // performance middleware
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(express.static('public')); // set the static files location to /public, so a reference to /img/logo.png will load /public/img/logo.png
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // create swagger route

// ROUTES - API
app.use(rebroadcastRouter); //v1/rebroadcast
app.use('/bot', botRouter); //v1/bot/defend, v1/bot/attack, v1/bot/statistics
app.use('/cursor', cursorRouter); //v1/timestamps, v1/campaign, v1/defend, v1/attack, v1/statistics

// ROUTES - HTML
app.get('/html-pug', (req, res) => {
    res.render('index', { title: 'Hey', message: 'Hello there!' });
});

// ROUTES - REDIRECTS
app.get('/', (req, res) => {
    res.redirect('/docs');
});

async function main() {
    await configureDB();
    await configureDATA(release);

    const update = updateStatus(release);

    // start express server
    app.listen(port, () => {
        // const every15seconds = new CronJob(
        //     '*/30 * * * * *', //'*/15 * * * * *',
        //     () => {
        //         const update = updateStatus(release);
        //     },
        //     null, // No onComplete function
        //     true, // Start the job right now)
        //     'Europe/Brussels' // Time zone);
        // );

        // const every30seconds = new CronJob(
        //     '*/20 * * * * *', //5 is so it's offset from the 15 above
        //     () => {
        //         getActiveSeason(release).then((season) => {
        //             const update = updateSeason(season);
        //         });
        //     },
        //     null, // No onComplete function
        //     true, // Start the job right now)
        //     'Europe/Brussels' // Time zone);
        // );

        log.info('APP - express is running');
        log.info(
            'APP - swagger documentation is available at ' +
                chalk.yellow.underline.underline(
                    'http://127.0.0.1:' + port + '/docs'
                ) +
                '\n'
        );
    });
}

main().catch((error) => {
    log.error('Failed to start server:', error);
    prisma.$disconnect();
});
