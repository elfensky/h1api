import express from 'express';
import { performance } from 'perf_hooks';
//db
import findDefendEventLatest from '../../prisma/func/findDefendEventLatest.js'; //db
import getAttackEvent from '../../prisma/func/getAttackEvent.js'; //db
//components
import getInfo from '../../utilities/info.js';
//setup
const router = express.Router();

/**
 * @swagger
 * /bot/defend:
 *   get:
 *     summary: Retrieve latest defend event.
 *     description: Fetches the latest defend event information from the database and returns it as JSON.
 *     tags:
 *       - Bot
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
router.get('/defend', async (req, res) => {
    try {
        const data = await findDefendEventLatest();
        if (!data) {
            throw new Error('failed findDefendEventLatest()');
        } else {
            const info = getInfo(req.startTime, 200);
            res.json({ info, data });
        }
    } catch (error) {
        console.error('Error fetching campaign data:', error);
        const info = getInfo(req.startTime, 500);
        res.status(info.code).json({ info, error: error.message });
    }
});

router.get('/defend/:id', async (req, res) => {
    console.log('/bot/defend/' + req.params.id);
    res.json({ api: '/defend/id', id: req.params.id });
});

router.get('/attack', async (req, res) => {
    try {
        const data = await getAttackEvent();
        if (!data) {
            throw new Error('failed getAttackEvent()');
        } else {
            const info = getInfo(req.startTime, 200);
            res.json({ info, data });
        }
    } catch (error) {
        console.error('Error fetching campaign data:', error);
        const info = getInfo(req.startTime, 500);
        res.status(info.code).json({ info, error: error.message });
    }
});

// router.get('/attack/:id', async (req, res) => {
//     console.log('/bot/attack/' + req.params.id);
//     res.json({ api: '/attack/id', id: req.params.id });
// });

export default router;
