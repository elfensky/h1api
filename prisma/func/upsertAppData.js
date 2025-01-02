import prisma from '../prisma.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

export default async function upsertAppData(season, data) {
    const start = performance.now();
    const release = 'helldivers1api@' + process.env.npm_package_version;
    const now = Date.now();

    try {
        const existingRecord = await prisma.appdata.findUnique({
            where: {
                id: release,
            },
        });

        if (!existingRecord) {
            log.info(
                '(1/7) APP - no existing appdata found, setting up app for initial use'
            );
        }

        // const upsertRecord = await prisma.appdata.upsert({
        //     where: {
        //         id: release,
        //     },
        //     update: {
        //         active_season: season,
        //         last_updated: now,
        //     },
        //     create: {
        //         id: release,
        //         active_season: season,
        //         last_updated: now,
        //     },
        // });

        // const action = existingRecord ? 'UPDATE' : 'CREATE';

        // log.info(
        //     chalk.white(`(2/7) ${action} APP`) +
        //         chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        // );

        // return upsertRecord; // Return the newly created event
    } catch (error) {
        throw error;
    }
}
