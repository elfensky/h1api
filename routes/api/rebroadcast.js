import express from 'express';
import multer from 'multer';
// components
import { rebroadcast_schema } from '../../utilities/zod.js';
import getInfo from '../../utilities/info.js';
import updateSeason from '../../auto/updateSeason.js';
//db
import getStatus from '../../prisma/func/getStatus.js';
import getSeason from '../../prisma/func/getSeason.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();
// setup
const router = express.Router();
const upload = multer({ dest: 'data/' });

/**
 * @swagger
 * /rebroadcast:
 *   post:
 *     tags:
 *       - Rebroadcast
 *     summary: Perform rebroadcast actions
 *     description: Endpoint to perform rebroadcast actions such as getting campaign status or snapshots.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 description: The action to perform. Supports 'get_campaign_status' and 'get_snapshots'.
 *                 example: get_campaign_status
 *               season:
 *                 type: integer
 *                 format: int32
 *                 minimum: 1
 *                 description: The season to get snapshots for. Required if action is 'get_snapshots'.
 *                 example: 143
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 description: The action to perform. Supports 'get_campaign_status' and 'get_snapshots'.
 *                 example: get_campaign_status
 *               season:
 *                 type: string
 *                 description: The season to get snapshots for. Required if action is 'get_snapshots'.
 *                 example: 143
 *     responses:
 *       200:
 *         description: Successfully retrieved data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the campaign.
 *                   example: active
 *                 # Add other properties as needed for 'get_snapshots' response
 *       400:
 *         description: Bad Request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: object
 *                   description: Information about the request.
 *                   properties:
 *                     duration:
 *                       type: number
 *                       description: Time taken to process the request.
 *                       example: 123.45
 *                 error:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Error messages indicating what went wrong.
 *                   example: ["action is required"]
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
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: failed DB get_campaign_status()
 */
router.post('/rebroadcast', upload.none(), async (req, res) => {
    const start = performance.now();
    const body = req.body;

    try {
        if (!body) {
            throw new Error('body is required');
        }

        if (!body.action) {
            throw new Error('action is required');
        }

        const validated = rebroadcast_schema.parse(body);

        if (validated.error) {
            throw new Error(validatedData.error);
        }

        if (validated.action === 'get_campaign_status') {
            const data = await getStatus();

            if (!data) {
                throw new Error('failed getStatus()', {
                    cause: 'routes/api/rebroadcast.js',
                });
            }

            res.json(data);
        }

        if (validated.action === 'get_snapshots') {
            const localData = await getSeason(validated.season);

            if (localData) {
                res.json(localData);
            } else {
                // const remote = await updateSeason(validated.season);
                // res.json(remote);
                updateSeason(validated.season).then((remote) => {
                    if (!remote) {
                        throw new Error(
                            `failed updateSeason(${validated.season})`,
                            {
                                cause: 'routes/api/rebroadcast.js',
                            }
                        );
                    }
                    res.json(remote);
                });
            }
        }
    } catch (error) {
        if (error.constructor.name === 'ZodError') {
            const messages = [];
            for (const issue of error.issues) {
                messages.push(issue.message);
            }
            const info = getInfo(start, 400);
            res.status(400).json({ info: info, error: messages });
        } else {
            log.error(chalk.red('(1/2) in ') + chalk.magenta(error.cause));
            log.error(chalk.red('(2/2) ' + error.stack));

            const info = getInfo(start, 400);
            res.status(400).json({ info: info, error: error.message });
        }
    }
});

export default router;
