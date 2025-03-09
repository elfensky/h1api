import prisma from '../prisma.js';
// logs, monitoring, etc
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

async function saveAttackEvent(data) {
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

        const newAttackEventArray = [];

        for (const event of data.attack_events) {
            const newAttackEvent = await prisma.attackEvent.create({
                data: {
                    timestamp: datetime,
                    season: event.season,
                    event_id: event.event_id,
                    start_time: event.start_time,
                    end_time: event.end_time,
                    enemy: event.enemy,
                    points_max: event.points_max,
                    points: event.points,
                    status: event.status,
                    players_at_start: event.players_at_start,
                    max_event_id: event.max_event_id,
                },
            });

            const keysToRemove = ['id', 'timestamp'];
            keysToRemove.forEach((key) => {
                delete newAttackEvent[key];
            });

            newAttackEventArray.push(newAttackEvent);
        }

        log.info(
            chalk.white('UPDATE - saved (4/5) ') +
                chalk.magenta(data.time) +
                chalk.white("'s attackEvent in ") +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );

        return newAttackEventArray;
    } catch (error) {
        log.error(chalk.red('saveDefendEvent() crashed: \n') + error.message);
        throw error;
    }
}

export default saveAttackEvent;
