// logs, monitoring, etc
import pino from 'pino'; // Low overhead Node.js logger
import chalk from 'chalk'; // Colorful terminal output
//dependencies
import dotenv from 'dotenv';
import express from 'express';
import { CronJob } from 'cron';
//custom
import getCampaignStatus from './utilities/getCampaignStatus.js';
//db
import prisma from './prisma/prisma.js';
import saveTimestamp from './prisma/saveTimestamp.js';
import saveDefendEvent from './prisma/saveDefendEvent.js';

// create and configure application
const app = express(); // create an express instance
app.use(express.static('public')); // set the static files location to /public, so a reference to /img/logo.png will load /public/img/logo.png
app.set('view engine', 'pug'); // set the view engine to pug

const port = 3000;

app.get('/', (req, res) => {
    // res.send("Hello World!");
    res.render('index', { title: 'Hey', message: 'Hello there!' });
});

app.post('/', (req, res) => {
    res.send('Got a POST request');
});

app.put('/user', (req, res) => {
    res.send('Got a PUT request at /user');
});

app.delete('/user', (req, res) => {
    res.send('Got a DELETE request at /user');
});

async function main() {
    // check if WAL mode is enabled, and enable if not
    const currentMode = await prisma.$queryRaw`PRAGMA journal_mode;`;
    console.log('Current journal mode:', currentMode);

    // If the current mode is not WAL, set it to WAL
    if (currentMode[0].journal_mode !== 'wal') {
        const result = await prisma.$queryRaw`PRAGMA journal_mode = WAL;`;
        console.log('Journal mode set to:', result);
    } else {
        console.log('Journal mode is already set to WAL.');
    }

    getCampaignStatus()
        .then((data) => {
            const timestamp = saveTimestamp(data);

            // saveDefendEvent(data);
            console.log(data);
        })
        .catch((error) =>
            console.error('Failed to get campaign status:', error)
        );

    // start express server
    app.listen(port, () => {
        const getDataFromAPI = new CronJob(
            '* * * * *',
            () => {
                getCampaignStatus()
                    .then((data) => {
                        saveDefendEvent(data);
                        console.log(data);
                    })
                    .catch((error) =>
                        console.error('Failed to get campaign status:', error)
                    );
            },
            null, // No onComplete function
            true, // Start the job right now)
            'Europe/Brussels' // Time zone);
        );

        getDataFromAPI.stop();

        console.log(`Example app listening on port ${port}`);
    });
}

main().catch((error) => {
    console.error('Failed to start server:', error);
    prisma.$disconnect();
});
