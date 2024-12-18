// logs, monitoring, etc
import pino from 'pino'; // Low overhead Node.js logger
import chalk from 'chalk'; // Colorful terminal output
//dependencies
import dotenv from 'dotenv';
import express from 'express';
import { CronJob } from 'cron';
//utils
import configureDB from './utilities/configureDB.js';
import fetchCampaignStatus from './utilities/fetchCampaignStatus.js';
import updateApiData from './utilities/updateApiData.js';
// //db
// import prisma from './prisma/prisma.js';
// import saveTimestamp from './prisma/saveTimestamp.js';
// import saveCampaignStatus from './prisma/saveCampaignStatus.js';
// import saveDefendEvent from './prisma/saveDefendEvent.js';
// import saveAttackEvent from './prisma/saveAttackEvent.js';
// import saveStatistics from './prisma/saveStatistics.js';
import getCampaignData from './prisma/getCampaignData.js';

// create and configure application
const app = express(); // create an express instance
app.use(express.static('public')); // set the static files location to /public, so a reference to /img/logo.png will load /public/img/logo.png
app.set('view engine', 'pug'); // set the view engine to pug

const port = 3000;

app.get('/', (req, res) => {
    // res.send("Hello World!");
    res.render('index', { title: 'Hey', message: 'Hello there!' });
});

app.get('/api/v1/campaign_status', async (req, res) => {
    // const data = await getCampaignData();
    // res.json(data);

    try {
        const data = await getCampaignData();
        const json = JSON.stringify(data, (_, v) =>
            typeof v === 'bigint' ? Number(v) : v
        );

        // res.json(data);
        res.setHeader('Content-Type', 'application/json');
        res.send(json);
    } catch (error) {
        console.error('Error fetching campaign data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
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

        // getDataFromAPI.stop();

        console.log(`Example app listening on port ${port}`);
    });
}

main().catch((error) => {
    console.error('Failed to start server:', error);
    prisma.$disconnect();
});
