import prisma from '../prisma.js';
// logs, monitoring, etc
import getLogger from '../../utilities/logger.js';
import chalk from 'chalk';
const log = getLogger();

async function saveDefendEvent(data) {
    const start = performance.now();
    try {
        const datetime = new Date(data.time * 1000); // epoch to Date(Time) object

        // Ensure that the timestamp exists in the Timestamp table
        const existingTimestamp = await prisma.timestamp.findUnique({
            where: { timestamp: datetime },
        });

        if (!existingTimestamp) {
            throw new Error(
                chalk.red('timestamp ') +
                    chalk.magenta(data.time) +
                    chalk.red(' does not exist.')
            );
        }

        const newDefendEvent = await prisma.defendEvent.create({
            data: {
                timestamp: datetime, // Assuming start_time is used as a unique identifier
                season: data.defend_event.season,
                event_id: data.defend_event.event_id,
                start_time: data.defend_event.start_time,
                end_time: data.defend_event.end_time,
                region: data.defend_event.region,
                enemy: data.defend_event.enemy,
                points_max: data.defend_event.points_max,
                points: data.defend_event.points,
                status: data.defend_event.status,
            },
        });

        log.info(
            chalk.white('UPDATE - saved (3/5) ') +
                chalk.magenta(data.time) +
                chalk.white("'s defendEvent in ") +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );

        const keysToRemove = ['id', 'timestamp'];
        keysToRemove.forEach((key) => {
            delete newDefendEvent[key];
        });

        return newDefendEvent;
    } catch (error) {
        log.error(chalk.red('saveDefendEvent() crashed: \n') + error.message);
        throw error;
    }
}

export default saveDefendEvent;
