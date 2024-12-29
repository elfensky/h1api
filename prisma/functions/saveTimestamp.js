import prisma from '../prisma.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

export default async function saveTimestamp(data) {
    const start = performance.now();
    try {
        const datetime = new Date(data.time * 1000); // epoch to Date(Time) object

        const existingTimestamp = await prisma.timestamp.findUnique({
            where: {
                timestamp: datetime,
            },
        });

        if (existingTimestamp) {
            log.info(`UPDATE - timestamp ${data.time} already exists.`);
            return existingTimestamp; // Optionally return the existing event
        } else {
            // If it doesn't exist, create a new timestamp
            const newEvent = await prisma.timestamp.create({
                data: {
                    timestamp: datetime,
                },
            });

            log.info(
                chalk.white('UPDATE - saved (1/5) ') +
                    chalk.magenta(data.time) +
                    chalk.white("'s timestamp in ") +
                    chalk.blue((performance.now() - start).toFixed(3) + ' ms')
                //+ chalk.magenta(JSON.stringify(newEvent))
            );
            return newEvent; // Return the newly created event
        }
    } catch (error) {
        log.error(
            chalk.red('UPDATE - saveTimestamp() crashed \n') +
                chalk.magenta(data.time) +
                chalk.red('\n' + error)
        );
        throw error;
    }
}
