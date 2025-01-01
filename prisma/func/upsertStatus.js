import prisma from '../prisma.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

export default async function upsertStatus(season, data) {
    const start = performance.now();

    try {
        const existingRecord = await prisma.status.findUnique({
            where: {
                time: data.time,
            },
        });

        const upsertRecord = await prisma.status.upsert({
            where: {
                time: data.time,
            },
            update: {
                season: season,
                attack_events: data.attack_events,
                campaign_status: data.campaign_status,
                defend_event: data.defend_event,
                statistics: data.statistics,
            },
            create: {
                season: season,
                time: data.time,
                attack_events: data.attack_events,
                campaign_status: data.campaign_status,
                defend_event: data.defend_event,
                statistics: data.statistics,
            },
        });

        const action = existingRecord ? 'UPDATE' : 'CREATE';

        log.info(
            chalk.white(`(1/8) ${action} STATUS`) +
                chalk.white("'s [core] in ") +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );

        return upsertRecord; // Return the newly created event
    } catch (error) {
        throw error;
    }
}
