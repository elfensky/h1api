import express from 'express';
// //db
// import prisma from './prisma/prisma.js';
// import saveTimestamp from './prisma/saveTimestamp.js';
// import saveCampaignStatus from './prisma/saveCampaignStatus.js';
// import saveDefendEvent from './prisma/saveDefendEvent.js';
// import saveAttackEvent from './prisma/saveAttackEvent.js';
// import saveStatistics from './prisma/saveStatistics.js';
import getRebroadcast from '../../prisma/functions/getRebroadcast.js';

const router = express.Router();

router.get('/v1/campaign', async (req, res) => {
    try {
        const data = await getRebroadcast();
        const json = JSON.stringify(data, (_, v) =>
            typeof v === 'bigint' ? Number(v) : v
        );

        res.setHeader('Content-Type', 'application/json');
        res.send(json);
    } catch (error) {
        console.error('Error fetching campaign data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;

// app.get('/v1/campaign', async (req, res) => {
//     // const data = await getRebroadcast();
//     // res.json(data);

//     try {
//         const data = await getRebroadcast();
//         const json = JSON.stringify(data, (_, v) =>
//             typeof v === 'bigint' ? Number(v) : v
//         );

//         res.setHeader('Content-Type', 'application/json');
//         res.send(json);
//     } catch (error) {
//         console.error('Error fetching campaign data:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
