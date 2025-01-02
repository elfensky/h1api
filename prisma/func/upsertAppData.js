import prisma from '../prisma.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

export default async function upsertAppData(season, release) {
    const start = performance.now();
    const now = new Date();

    try {
        const existingRecord = await prisma.appdata.findUnique({
            where: {
                id: release,
            },
        });

        const upsertRecord = await prisma.appdata.upsert({
            where: {
                id: release,
            },
            update: {
                active_season: season,
                last_updated: now,
            },
            create: {
                id: release,
                active_season: season,
                last_updated: now,
            },
        });

        const action = existingRecord ? 'UPDATED' : 'CREATED';

        log.info(
            chalk.white(`(2/2) ${action} APPDATA `) +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );

        return upsertRecord; // Return the newly created event
    } catch (error) {
        throw error;
    }
}
