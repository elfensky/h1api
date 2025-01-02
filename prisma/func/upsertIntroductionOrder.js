import prisma from '../prisma.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

export default async function upsertIntroductionOrder(season, data) {
    const start = performance.now();

    try {
        const existingRecord = await prisma.introduction_order.findUnique({
            where: {
                season: season,
            },
        });

        const upsertRecord = await prisma.introduction_order.upsert({
            where: {
                season: season,
            },
            update: {
                json: data.introduction_order,
            },
            create: {
                season: season,
                json: data.introduction_order,
            },
        });

        const action = existingRecord ? 'UPDATE' : 'CREATE';

        log.info(
            chalk.white(`(3/9) ${action} SEASON `) +
                chalk.magenta(season) +
                chalk.white("'s [introduction_order] in ") +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );

        return upsertRecord; // Return the newly created event
    } catch (error) {
        throw error;
    }
}
