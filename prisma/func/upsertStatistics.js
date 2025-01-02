import prisma from '../prisma.js';
import getHash from 'object-hash';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

export default async function upsertStatistics(season, data) {
    const start = performance.now();
    try {
        const recordList = [];
        let action = 'UNKNOWN';

        for (const [key, stat] of data.statistics.entries()) {
            const hash = getHash(stat); //generate a unique hash for each statistic

            const existingRecord = await prisma.statistics.findUnique({
                where: {
                    hash: hash,
                },
            });

            const upsertRecord = await prisma.statistics.upsert({
                where: {
                    hash: hash,
                },
                update: {
                    hash: hash,
                    time: data.time,
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
                create: {
                    hash: hash,
                    time: data.time,
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

            // console.log('upsertRecord:', upsertRecord);

            // const keysToRemove = ['id', 'time'];
            // keysToRemove.forEach((key) => {
            //     delete upsertRecord[key];
            // });

            action = existingRecord ? 'UPDATE' : 'CREATE';
            recordList.push(upsertRecord);
        }
        console.log('recordList:', recordList);
        log.info(
            chalk.white(`(5/7) ${action} STATUS`) +
                chalk.white(
                    `'s [${chalk.magenta(recordList.length)} statistics] in `
                ) +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );

        return recordList; // Return the newly created event
    } catch (error) {
        throw error;
    }
}
