import prisma from '../prisma.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';

const log = getLogger();

export default async function getAppDataById(id) {
    const start = performance.now();

    try {
        // Retrieve the app data by ID
        const appData = await prisma.appdata.findUnique({
            where: {
                id: id,
            },
        });

        if (!appData) {
            log.warn(chalk.yellow(`No app data found for ID: ${id}`));
            return null; // Or handle the case where no data is found
        }

        log.info(
            chalk.white(`(1/1) RETRIEVED APPDATA `) +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );

        return appData;
    } catch (error) {
        log.error(chalk.red('Error retrieving app data:'), error);
        throw error; // Re-throw the error after logging it
    }
}
