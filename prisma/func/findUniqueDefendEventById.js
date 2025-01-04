import prisma from '../prisma.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';

const log = getLogger();

export default async function getDefendEventById(event_id) {
    const start = performance.now();

    try {
        // Retrieve the app data by ID
        const event = await prisma.defend_events.findUnique({
            where: {
                event_id: event_id,
            },
        });

        return event;
    } catch (error) {
        log.error(chalk.red('Error retrieving defend_events data:'), error);
        throw error; // Re-throw the error after logging it
    }
}
