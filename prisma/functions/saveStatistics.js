import prisma from '../prisma.js';
// logs, monitoring, etc
import getLogger from '../../utilities/logger.js';
import chalk from 'chalk';
const log = getLogger();

async function saveStatistics(data) {
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

        const newStatisticArray = [];

        for (const stat of data.statistics) {
            const newStatistic = await prisma.statistic.create({
                data: {
                    timestamp: datetime,
                    season: stat.season,
                    season_duration: stat.season_duration,
                    enemy: stat.enemy,
                    players: stat.players,
                    total_unique_players: stat.total_unique_players,
                    missions: stat.missions,
                    successful_missions: stat.successful_missions,
                    total_mission_difficulty: stat.total_mission_difficulty,
                    completed_planets: stat.completed_planets,
                    defend_events: stat.defend_events,
                    successful_defend_events: stat.successful_defend_events,
                    attack_events: stat.attack_events,
                    successful_attack_events: stat.successful_attack_events,
                    deaths: stat.deaths,
                    kills: stat.kills,
                    accidentals: stat.accidentals,
                    shots: stat.shots,
                    hits: stat.hits,
                },
            });

            for (const key in newStatistic) {
                if (typeof newStatistic[key] === 'bigint') {
                    newStatistic[key] = Number(newStatistic[key]);
                }
            } // Convert BigInt to Number

            const keysToRemove = ['id', 'timestamp'];
            keysToRemove.forEach((key) => {
                delete newStatistic[key];
            });

            newStatisticArray.push(newStatistic);
        }

        log.info(
            chalk.white('UPDATE - saved (5/5) ') +
                chalk.magenta(data.time) +
                chalk.white("'s statistics in ") +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );

        return newStatisticArray;
    } catch (error) {
        log.error(chalk.red('saveDefendEvent() crashed: \n') + error.message);
        throw error;
    }
}

export default saveStatistics;
