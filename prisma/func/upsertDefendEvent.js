import prisma from '../prisma.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

export default async function upsertDefendEvent(season, data) {
    const start = performance.now();
    try {
        const existingRecord = await prisma.defend_events.findUnique({
            where: {
                event_id: data.defend_event.event_id,
            },
        });

        const upsertRecord = await prisma.defend_events.upsert({
            where: {
                event_id: data.defend_event.event_id,
            },
            update: {
                season: season,
                start_time: data.defend_event.start_time,
                end_time: data.defend_event.end_time,
                region: data.defend_event.region,
                enemy: data.defend_event.enemy,
                points_max: data.defend_event.points_max,
                points: data.defend_event.points,
                status: data.defend_event.status,
            },
            create: {
                season: season,
                event_id: data.defend_event.event_id,
                start_time: data.defend_event.start_time,
                end_time: data.defend_event.end_time,
                region: data.defend_event.region,
                enemy: data.defend_event.enemy,
                points_max: data.defend_event.points_max,
                points: data.defend_event.points,
                status: data.defend_event.status,
            },
        });

        const action = existingRecord ? 'UPDATE' : 'CREATE';

        log.info(
            chalk.white(`(3/7) ${action} STATUS`) +
                chalk.white(`'s [defend event] in `) +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );

        const keysToRemove = ['id', 'season'];
        keysToRemove.forEach((key) => {
            delete upsertRecord[key];
        });

        return upsertRecord; // Return the newly created event
    } catch (error) {
        throw error;
    }
}
