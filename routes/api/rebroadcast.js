import express from 'express';
import { performance } from 'perf_hooks';
import multer from 'multer';
// components
import { post_rebroadcast_schema } from '../../utilities/zod.js';
import getRebroadcast from '../../prisma/functions/getRebroadcast.js'; //db
import getInfo from '../../utilities/info.js';
// setup
const router = express.Router();
const upload = multer({ dest: 'data/' });

/**
 * @swagger
 * /rebroadcast:
 *   get:
 *     tags:
 *       - Rebroadcast
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
router.get('/rebroadcast', async (req, res) => {
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

/**
 * @swagger
 * /rebroadcast:
 *   post:
 *     tags:
 *       - Rebroadcast
 *     summary: Perform rebroadcast actions
 *     description: Endpoint to perform rebroadcast actions such as getting campaign status.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 description: The action to perform. Currently supports 'get_campaign_status'.
 *                 example: get_campaign_status
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 description: The action to perform. Currently supports 'get_campaign_status'.
 *                 example: get_campaign_status
 *     responses:
 *       200:
 *         description: Successfully retrieved campaign status data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 # Define the structure of the successful response data here
 *                 status:
 *                   type: string
 *                   description: The status of the campaign.
 *                   example: active
 *                 # Add other properties as needed
 *       400:
 *         description: Bad Request - Invalid action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating invalid action.
 *                   example: Invalid action
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: object
 *                   description: Information about the error.
 *                   properties:
 *                     code:
 *                       type: integer
 *                       description: HTTP status code.
 *                       example: 500
 *                     # Add other properties as needed
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: failed DB get_campaign_status()
 */
router.post('/rebroadcast', upload.none(), async (req, res) => {
    const start = performance.now();
    const body = req.body;

    try {
        // Validate and parse the request body
        const validatedData = post_rebroadcast_schema.parse(req.body);
        return res.json(validatedData);
        throw new Error('validatedData: ' + JSON.stringify(validatedData));
    } catch (e) {
        res.status(400).json({ errors: e.errors });
    }

    if (body.action === 'get_campaign_status') {
        try {
            const data = await getRebroadcast();
            if (!data) {
                throw new Error('failed DB get_campaign_status()');
            } else {
                res.json(data);
            }
        } catch (error) {
            console.error(
                'failed POST /rebroadcast - get_campaign_status() -',
                error.message
            );
            const info = getInfo(start, 500);
            res.status(info.code).json({ info, error: error.message });
        }
    }
});

export default router;
