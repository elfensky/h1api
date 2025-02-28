import prisma from '../prisma.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';

const log = getLogger();

export default async function getActiveSeason(id) {
    const start = performance.now();
    const release = 'helldivers1api@' + process.env.npm_package_version;

    try {
        // Retrieve the app data by ID
        const appData = await prisma.appdata.findUnique({
            where: {
                id: id || release,
            },
        });

        return appData.active_season;
    } catch (error) {
        log.error(chalk.red('Error retrieving app data:'), error);
        throw error; // Re-throw the error after logging it
    }
}
