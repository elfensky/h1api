import express from 'express';
// Assume you have a function to get timestamps from your database
import prisma from '../../prisma/prisma.js';
import getInfo from '../../utilities/info.js';
import isValidUUIDv7 from '../../utilities/isValidUUIDv7.js';
import HttpError from '../../utilities/HttpError.js';
// setup
const router = express.Router();

/**
 * @swagger
 * /v1/timestamps:
 *   get:
 *     summary: Retrieve a list of timestamps
 *     description: Fetch a paginated list of timestamps with optional cursor-based pagination.
 *     tags:
 *       - Cursors
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: The cursor for pagination. If provided, the response will skip to the next set of results after this cursor.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of timestamps to return. Defaults to 10.
 *     responses:
 *       200:
 *         description: A list of timestamps
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: object
 *                   properties:
 *                     ms:
 *                       type: number
 *                       description: Time taken to process the request in milliseconds.
 *                     code:
 *                       type: integer
 *                       description: HTTP status code.
 *                     status:
 *                       type: string
 *                       description: Status message.
 *                     next:
 *                       type: string
 *                       nullable: true
 *                       description: Cursor for the next set of results, if available.
 *                     total:
 *                       type: integer
 *                       description: Total number of timestamps available.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unique identifier for the timestamp.
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp value.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: object
 *                   description: Information about the request and error
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get('/v1/timestamps', async (req, res) => {
    const cursor = req.query.cursor || null; //
    const limit = parseInt(req.query.limit) || null;

    try {
        if (cursor !== null) {
            if (!isValidUUIDv7(cursor)) {
                throw new HttpError('if present, cursor must be a UUIDv7', 400);
            }
        }

        if (typeof limit !== 'number' || limit < 1) {
            throw new HttpError('limit must be a positive integer', 400);
        }

        // throw new Error('getTimestamps() not implemented');
        const timestamps = await prisma.timestamp.findMany({
            take: limit || 10, // amount of timestamps to return
            skip: cursor ? 1 : 0, // Skip the cursor if provided
            orderBy: { id: 'desc' },
            cursor: cursor ? { id: cursor } : undefined,
        });

        const total = await prisma.timestamp.count();

        const next =
            timestamps.length === limit
                ? timestamps[timestamps.length - 1].id
                : null;

        const info = getInfo(req.startTime, 200, next, total);
        res.json({ info, data: timestamps });
    } catch (error) {
        const statusCode = error instanceof HttpError ? error.statusCode : 500;
        const info = getInfo(req.startTime, statusCode);
        res.status(statusCode).json({ info, error: error.message });
        throw error;
    }
});

/**
 * @swagger
 * /v1/campaigns:
 *   get:
 *     summary: Retrieve a list of campaigns
 *     description: Fetch a paginated list of campaigns with optional cursor-based pagination.
 *     tags:
 *       - Cursors
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: The cursor for pagination. If provided, the response will skip to the next set of results after this cursor.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of campaigns to return. Defaults to 10.
 *     responses:
 *       200:
 *         description: A list of campaigns
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: object
 *                   properties:
 *                     ms:
 *                       type: number
 *                       description: Time taken to process the request in milliseconds.
 *                     code:
 *                       type: integer
 *                       description: HTTP status code.
 *                     status:
 *                       type: string
 *                       description: Status message.
 *                     next:
 *                       type: string
 *                       nullable: true
 *                       description: Cursor for the next set of results, if available.
 *                     total:
 *                       type: integer
 *                       description: Total number of campaigns available.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unique identifier for the campaign.
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of the campaign.
 *                       season:
 *                         type: integer
 *                         description: Season number of the campaign.
 *                       points:
 *                         type: integer
 *                         description: Points scored in the campaign.
 *                       points_taken:
 *                         type: integer
 *                         description: Points taken in the campaign.
 *                       points_max:
 *                         type: integer
 *                         description: Maximum points possible in the campaign.
 *                       status:
 *                         type: string
 *                         description: Status of the campaign (e.g., active, hidden).
 *                       introduction_order:
 *                         type: integer
 *                         description: Order of introduction for the campaign.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: object
 *                   description: Information about the request and error
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get('/v1/campaigns', async (req, res) => {
    const cursor = req.query.cursor || null; //
    const limit = parseInt(req.query.limit) || 10;

    try {
        if (cursor !== null) {
            if (!isValidUUIDv7(cursor)) {
                throw new HttpError('if present, cursor must be a UUIDv7', 400);
            }
        }

        if (typeof limit !== 'number' || limit < 1) {
            throw new HttpError('limit must be a positive integer', 400);
        }

        const campaigns = await prisma.campaignStatus.findMany({
            take: limit, // amount of timestamps to return
            skip: cursor ? 1 : 0, // Skip the cursor if provided
            orderBy: { id: 'desc' },
            cursor: cursor ? { id: cursor } : undefined,
        });
        const total = await prisma.campaignStatus.count();
        const next =
            campaigns.length === limit
                ? campaigns[campaigns.length - 1].id
                : null;

        const info = getInfo(req.startTime, 200, next, total);
        res.json({ info, data: campaigns });
    } catch (error) {
        const info = getInfo(req.startTime, 500);
        res.status(info.code).json({ info, error: error.message });
        throw error;
    }
});

/**
 * @swagger
 * /v1/defences:
 *   get:
 *     summary: Retrieve a list of defence events
 *     description: Fetch a paginated list of defence events with optional cursor-based pagination.
 *     tags:
 *       - Cursors
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: The cursor for pagination. If provided, the response will skip to the next set of results after this cursor.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of defence events to return. Defaults to 10.
 *     responses:
 *       200:
 *         description: A list of defence events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: object
 *                   properties:
 *                     ms:
 *                       type: number
 *                       description: Time taken to process the request in milliseconds.
 *                     code:
 *                       type: integer
 *                       description: HTTP status code.
 *                     status:
 *                       type: string
 *                       description: Status message.
 *                     next:
 *                       type: string
 *                       nullable: true
 *                       description: Cursor for the next set of results, if available.
 *                     total:
 *                       type: integer
 *                       description: Total number of defence events available.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unique identifier for the defence event.
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of the defence event.
 *                       season:
 *                         type: integer
 *                         description: Season number of the defence event.
 *                       event_id:
 *                         type: integer
 *                         description: Identifier for the event.
 *                       start_time:
 *                         type: integer
 *                         description: Start time of the event in epoch seconds.
 *                       end_time:
 *                         type: integer
 *                         description: End time of the event in epoch seconds.
 *                       region:
 *                         type: integer
 *                         description: Region code for the event.
 *                       enemy:
 *                         type: integer
 *                         description: Enemy code for the event.
 *                       points_max:
 *                         type: integer
 *                         description: Maximum points possible in the event.
 *                       points:
 *                         type: integer
 *                         description: Points scored in the event.
 *                       status:
 *                         type: string
 *                         description: Status of the event (e.g., success, fail).
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: object
 *                   description: Information about the request and error
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get('/v1/defences', async (req, res) => {
    const cursor = req.query.cursor || null; //
    const limit = parseInt(req.query.limit) || 10;

    try {
        if (cursor !== null) {
            if (!isValidUUIDv7(cursor)) {
                throw new HttpError('if present, cursor must be a UUIDv7', 400);
            }
        }

        if (typeof limit !== 'number' || limit < 1) {
            throw new HttpError('limit must be a positive integer', 400);
        }

        const defences = await prisma.defendEvent.findMany({
            take: limit, // amount of timestamps to return
            skip: cursor ? 1 : 0, // Skip the cursor if provided
            orderBy: { id: 'desc' },
            cursor: cursor ? { id: cursor } : undefined,
        });
        const total = await prisma.defendEvent.count();
        const next =
            defences.length === limit ? defences[defences.length - 1].id : null;

        const info = getInfo(req.startTime, 200, next, total);
        res.json({ info, data: defences });
    } catch (error) {
        const info = getInfo(req.startTime, 500);
        res.status(info.code).json({ info, error: error.message });
        throw error;
    }
});

/**
 * @swagger
 * /v1/attacks:
 *   get:
 *     summary: Retrieve a list of attack events
 *     description: Fetch a paginated list of attack events with optional cursor-based pagination.
 *     tags:
 *       - Cursors
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: The cursor for pagination. If provided, the response will skip to the next set of results after this cursor.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of attack events to return. Defaults to 10.
 *     responses:
 *       200:
 *         description: A list of attack events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: object
 *                   properties:
 *                     ms:
 *                       type: number
 *                       description: Time taken to process the request in milliseconds.
 *                     code:
 *                       type: integer
 *                       description: HTTP status code.
 *                     status:
 *                       type: string
 *                       description: Status message.
 *                     next:
 *                       type: string
 *                       nullable: true
 *                       description: Cursor for the next set of results, if available.
 *                     total:
 *                       type: integer
 *                       description: Total number of attack events available.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unique identifier for the attack event.
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of the attack event.
 *                       season:
 *                         type: integer
 *                         description: Season number of the attack event.
 *                       event_id:
 *                         type: integer
 *                         description: Identifier for the event.
 *                       start_time:
 *                         type: integer
 *                         description: Start time of the event in epoch seconds.
 *                       end_time:
 *                         type: integer
 *                         description: End time of the event in epoch seconds.
 *                       enemy:
 *                         type: integer
 *                         description: Enemy code for the event.
 *                       points_max:
 *                         type: integer
 *                         description: Maximum points possible in the event.
 *                       points:
 *                         type: integer
 *                         description: Points scored in the event.
 *                       status:
 *                         type: string
 *                         description: Status of the event (e.g., success, fail).
 *                       players_at_start:
 *                         type: integer
 *                         description: Number of players at the start of the event.
 *                       max_event_id:
 *                         type: integer
 *                         description: Maximum event ID.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: object
 *                   description: Information about the request and error
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get('/v1/attacks', async (req, res) => {
    const cursor = req.query.cursor || null; //
    const limit = parseInt(req.query.limit) || 10;

    try {
        if (cursor !== null) {
            if (!isValidUUIDv7(cursor)) {
                throw new HttpError('if present, cursor must be a UUIDv7', 400);
            }
        }

        if (typeof limit !== 'number' || limit < 1) {
            throw new HttpError('limit must be a positive integer', 400);
        }

        const attacks = await prisma.attackEvent.findMany({
            take: limit, // amount of timestamps to return
            skip: cursor ? 1 : 0, // Skip the cursor if provided
            orderBy: { id: 'desc' },
            cursor: cursor ? { id: cursor } : undefined,
        });
        const total = await prisma.attackEvent.count();
        const next =
            attacks.length === limit ? attacks[attacks.length - 1].id : null;

        const info = getInfo(req.startTime, 200, next, total);
        res.json({ info, data: attacks });
    } catch (error) {
        const info = getInfo(req.startTime, 500);
        res.status(info.code).json({ info, error: error.message });
        throw error;
    }
});

/**
 * @swagger
 * /v1/statistics:
 *   get:
 *     summary: Retrieve a list of statistics
 *     description: Fetch a paginated list of statistics with optional cursor-based pagination.
 *     tags:
 *       - Cursors
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: The cursor for pagination. If provided, the response will skip to the next set of results after this cursor.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of statistics to return. Defaults to 10.
 *     responses:
 *       200:
 *         description: A list of statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: object
 *                   properties:
 *                     ms:
 *                       type: number
 *                       description: Time taken to process the request in milliseconds.
 *                     code:
 *                       type: integer
 *                       description: HTTP status code.
 *                     status:
 *                       type: string
 *                       description: Status message.
 *                     next:
 *                       type: string
 *                       nullable: true
 *                       description: Cursor for the next set of results, if available.
 *                     total:
 *                       type: integer
 *                       description: Total number of statistics available.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unique identifier for the statistic.
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of the statistic.
 *                       season:
 *                         type: integer
 *                         description: Season number of the statistic.
 *                       season_duration:
 *                         type: integer
 *                         description: Duration of the season.
 *                       enemy:
 *                         type: integer
 *                         description: Enemy code for the statistic.
 *                       players:
 *                         type: integer
 *                         description: Number of players.
 *                       total_unique_players:
 *                         type: integer
 *                         description: Total number of unique players.
 *                       missions:
 *                         type: integer
 *                         description: Total number of missions.
 *                       successful_missions:
 *                         type: integer
 *                         description: Number of successful missions.
 *                       total_mission_difficulty:
 *                         type: integer
 *                         description: Total mission difficulty.
 *                       completed_planets:
 *                         type: integer
 *                         description: Number of completed planets.
 *                       defend_events:
 *                         type: integer
 *                         description: Number of defend events.
 *                       successful_defend_events:
 *                         type: integer
 *                         description: Number of successful defend events.
 *                       attack_events:
 *                         type: integer
 *                         description: Number of attack events.
 *                       successful_attack_events:
 *                         type: integer
 *                         description: Number of successful attack events.
 *                       deaths:
 *                         type: integer
 *                         description: Number of deaths.
 *                       kills:
 *                         type: integer
 *                         description: Number of kills.
 *                       accidentals:
 *                         type: integer
 *                         description: Number of accidental events.
 *                       shots:
 *                         type: integer
 *                         description: Number of shots fired.
 *                       hits:
 *                         type: integer
 *                         description: Number of hits.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 info:
 *                   type: object
 *                   description: Information about the request and error
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get('/v1/statistics', async (req, res) => {
    const cursor = req.query.cursor || null; //
    const limit = parseInt(req.query.limit) || 10;

    try {
        if (cursor !== null) {
            if (!isValidUUIDv7(cursor)) {
                throw new HttpError('if present, cursor must be a UUIDv7', 400);
            }
        }

        if (typeof limit !== 'number' || limit < 1) {
            throw new HttpError('limit must be a positive integer', 400);
        }

        const statistics = await prisma.statistic.findMany({
            take: limit, // amount of timestamps to return
            skip: cursor ? 1 : 0, // Skip the cursor if provided
            orderBy: { id: 'desc' },
            cursor: cursor ? { id: cursor } : undefined,
        });

        //BigInt to Number
        statistics.forEach((stat) => {
            for (const key in stat) {
                if (typeof stat[key] === 'bigint') {
                    stat[key] = Number(stat[key]);
                }
            }
        });

        const total = await prisma.attackEvent.count();

        const next =
            statistics.length === limit
                ? statistics[statistics.length - 1].id
                : null;

        const info = getInfo(req.startTime, 200, next, total);
        res.json({ info, data: statistics });
    } catch (error) {
        const info = getInfo(req.startTime, 500);
        res.status(info.code).json({ info, error: error.message });
        throw error;
    }
});

export default router;
