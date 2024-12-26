import express from 'express';
import { performance } from 'perf_hooks';
// components
import getRebroadcast from '../../prisma/functions/getRebroadcast.js'; //db
import getInfo from '../../utilities/info.js';
// setup
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
    const start = performance.now();
    try {
        const data = await getRebroadcast();
        if (!data) {
            throw new Error('failed getDefendEvent()');
        } else {
            res.json(data);
        }
    } catch (error) {
        console.error('rebroadcast.js - ', error);
        const info = getInfo(start, 500);
        res.status(info.code).json({ info, error: error.message });
    }
});

export default router;
