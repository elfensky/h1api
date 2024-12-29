import prisma from '../prisma.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

export default async function upsertPointsMax(season, data) {
    const start = performance.now();

    try {
        const existingRecord = await prisma.points_max.findUnique({
            where: {
                season: season,
            },
        });

        const upsertRecord = await prisma.points_max.upsert({
            where: {
                season: season,
            },
            update: {
                json: data.points_max,
            },
            create: {
                season: season,
                json: data.points_max,
            },
        });

        const action = existingRecord ? 'UPDATE' : 'CREATE';

        log.info(
            chalk.white(`(3/8) ${action} SEASON `) +
                chalk.magenta(season) +
                chalk.white("'s [points_max] in ") +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );

        return upsertRecord; // Return the newly created event
    } catch (error) {
        throw error;
    }
}
