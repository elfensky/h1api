import prisma from '../prisma.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

export default async function upsertAttackEvents(season, data) {
    const start = performance.now();
    try {
        const recordList = [];
        let action = 'UNKNOWN';

        for (const [key, event] of data.attack_events.entries()) {
            const existingRecord = await prisma.attack_events.findUnique({
                where: {
                    event_id: event.event_id,
                },
            });

            const upsertRecord = await prisma.attack_events.upsert({
                where: {
                    event_id: event.event_id,
                },
                update: {
                    season: season,
                    start_time: event.start_time,
                    end_time: event.end_time,
                    enemy: event.enemy,
                    points_max: event.points_max,
                    points: event.points,
                    status: event.status,
                    players_at_start: event.players_at_start,
                },
                create: {
                    season: season,
                    event_id: event.event_id,
                    start_time: event.start_time,
                    end_time: event.end_time,
                    enemy: event.enemy,
                    points_max: event.points_max,
                    points: event.points,
                    status: event.status,
                    players_at_start: event.players_at_start,
                },
            });

            const keysToRemove = ['id'];
            keysToRemove.forEach((key) => {
                delete upsertRecord[key];
            });

            action = existingRecord ? 'UPDATE' : 'CREATE';
            recordList.push(upsertRecord);
        }

        log.info(
            chalk.white(`(6/8) ${action} SEASON `) +
                chalk.magenta(season) +
                chalk.white(
                    `'s [${chalk.magenta(recordList.length)} attack events] in `
                ) +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );

        return recordList; // Return the newly created event
    } catch (error) {
        throw error;
    }
}
