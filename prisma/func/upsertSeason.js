import prisma from '../prisma.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

export default async function upsertSeason(season, data) {
    const start = performance.now();

    try {
        const existingRecord = await prisma.season.findUnique({
            where: {
                season: season,
            },
        });

        const upsertRecord = await prisma.season.upsert({
            where: {
                season: season,
            },
            update: {
                time: data.time,
            },
            create: {
                season: season,
                time: data.time,
            },
        });

        const action = existingRecord ? 'UPDATE' : 'CREATE';

        log.info(
            chalk.white(`(1/8) ${action} SEASON `) +
                chalk.magenta(season) +
                chalk.white("'s [core data] in ") +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );

        return upsertRecord; // Return the newly created event
    } catch (error) {
        throw error;
    }
}
