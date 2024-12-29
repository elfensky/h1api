import prisma from '../prisma.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

export default async function upsertSnapshots(season, data) {
    const start = performance.now();

    try {
        const recordList = [];
        let action = 'UNKNOWN';

        for (const [key, snapshot] of data.snapshots.entries()) {
            const existingRecord = await prisma.snapshots.findUnique({
                where: {
                    time: snapshot.time,
                },
            });

            const upsertRecord = await prisma.snapshots.upsert({
                where: {
                    time: snapshot.time,
                },
                update: {
                    season: season,
                    data: snapshot.data,
                },
                create: {
                    season: season,
                    time: snapshot.time,
                    data: snapshot.data,
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
            chalk.white(`(4/8) ${action} SEASON `) +
                chalk.magenta(season) +
                chalk.white(
                    `'s [${chalk.magenta(recordList.length)} snapshots] in `
                ) +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );

        return recordList; // Return the newly created event
    } catch (error) {
        throw error;
    }
}
