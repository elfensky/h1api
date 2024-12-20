import express from 'express';
import getCampaignData from '../../prisma/getCampaignData.js'; //db

const router = express.Router();

router.get('/v1/rebroadcast', async (req, res) => {
    try {
        const data = await getCampaignData();
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
