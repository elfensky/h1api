import prisma from './prisma.js';

export default async function saveStatistics(data) {
    try {
        // Ensure that the timestamp exists in the Timestamp table
        const existingTimestamp = await prisma.timestamp.findUnique({
            where: { timestamp: data.time },
        });

        if (!existingTimestamp) {
            throw new Error(
                `newAttackEvent() | Timestamp ${data.time} does not exist.`
            );
        }

        const newStatisticArray = [];

        for (const stat of data.statistics) {
            const newStatistic = await prisma.statistic.create({
                data: {
                    timestamp: data.time,
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
            newStatisticArray.push(newStatistic);
        }
        console.log('newAttackEvent() | Campaign event saved successfully.');
        return newStatisticArray;
    } catch (error) {
        console.error(
            'newAttackEvent() | Failed to save campaign event:',
            error
        );
    }
}
