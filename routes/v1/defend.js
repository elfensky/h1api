import express from 'express';
import { performance } from 'perf_hooks';
//components
import getDefendEvent from '../../prisma/functions/getDefendEvent.js'; //db
import getInfo from '../../utilities/info.js';
import json from '../../utilities/json.js';
//setup
const router = express.Router();

/**
 * @swagger
 * /v1/defend:
 *   get:
 *     summary: Retrieve latest defend event.
 *     description: Fetches the latest defend event information from the database and returns it as JSON.
 *     tags:
 *       - API
 *     responses:
 *       200:
 *         description: A list of defend events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   season:
 *                     type: integer
 *                     description: The season number.
 *                     example: 142
 *                   event_id:
 *                     type: integer
 *                     description: The unique identifier for the event.
 *                     example: 4234
 *                   start_time:
 *                     type: integer
 *                     description: The start time of the event as a Unix timestamp.
 *                     example: 1734603962
 *                   end_time:
 *                     type: integer
 *                     description: The end time of the event as a Unix timestamp.
 *                     example: 1734776762
 *                   region:
 *                     type: integer
 *                     description: The region code.
 *                     example: 0
 *                   enemy:
 *                     type: integer
 *                     description: The enemy code.
 *                     example: 1
 *                   points_max:
 *                     type: integer
 *                     description: The maximum points achievable in the event.
 *                     example: 39658
 *                   points:
 *                     type: integer
 *                     description: The current points scored in the event.
 *                     example: 37582
 *                   status:
 *                     type: string
 *                     description: The current status of the event.
 *                     example: "active"
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
router.get('/v1/defend', async (req, res) => {
    const start = performance.now();
    try {
        const data = await getDefendEvent();
        if (!data) {
            throw new Error('failed getDefendEvent()');
        } else {
            if (data.status !== 'active') {
                const info = getInfo(start, 404);
                res.status(info.code).json({ info, data });
                // res.status(info.code).send(json({ info, data }));
            } else {
                const info = getInfo(start, 200);
                res.status(info.code).json({ info, data });
                // res.status(info.code).send(json({ info, data }));
            }
        }
    } catch (error) {
        console.error('Error fetching campaign data:', error);
        const info = getInfo(start, 500);
        res.status(info.code).json({ info, error: error.message });
    }
});

export default router;
