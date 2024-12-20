import express from 'express';
import getCampaignData from '../../prisma/functions/getCampaignData.js'; //db

const router = express.Router();

/**
 * @swagger
 * /v1/rebroadcast:
 *   get:
 *     tags:
 *       - API
 *     summary: Retrieve campaign data
 *     description: Fetches campaign data from the database and returns it as JSON.
 *     responses:
 *       200:
 *         description: Successfully retrieved campaign data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The campaign ID
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: The name of the campaign
 *                     example: "Campaign Name"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
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
