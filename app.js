// logs, monitoring, etc
import pino from 'pino'; // Low overhead Node.js logger
import chalk from 'chalk'; // Colorful terminal output
//dependencies
import dotenv from 'dotenv';
import express from 'express';
import { CronJob } from 'cron';
// documentation
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
//utils
import configureDB from './utilities/configureDB.js';
import fetchCampaignStatus from './utilities/fetchCampaignStatus.js';
import updateApiData from './utilities/updateApiData.js';
//routes
import rebroadcastRoute from './routes/v1/rebroadcast.js';
import defendRoute from './routes/v1/defend.js';

// create and configure application
const app = express(); // create an express instance
app.use(express.static('public')); // set the static files location to /public, so a reference to /img/logo.png will load /public/img/logo.png
app.set('view engine', 'pug'); // set the view engine to pug
const port = 3000;
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Helldivers I',
        version: '1.0.0',
        description: 'A description of your API',
    },
    servers: [
        {
            url: 'http://localhost:3000',
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
// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(rebroadcastRoute); //v1/rebroadcast
app.use(defendRoute); //v1/defend

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

        // getDataFromAPI.stop();
        console.log(`API is running on 127.0.0.1:${port}`);
        console.log(
            `Swagger docs are available at http://127.0.0.1:${port}/docs`
        );

        // console.log(`Example app listening on port ${port}`);
    });
}

main().catch((error) => {
    console.error('Failed to start server:', error);
    prisma.$disconnect();
});
