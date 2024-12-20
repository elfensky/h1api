import prisma from './prisma.js';

export default async function getCampaignData() {
    // Get latest Timestamp record
    const latestTimestamp = await prisma.timestamp.findFirst({
        orderBy: {
            timestamp: 'desc', // Sort by the timestamp field in descending order
        },
    });

    if (!latestTimestamp) {
        throw new Error('No timestamp found in database.');
    }

    // console.log('getCampaignData() | Latest timestamp:', latestTimestamp);

    // Get all CampaignStatus records for the latest timestamp
    const campaignStatus = await prisma.campaignStatus.findMany({
        where: {
            timestamp: latestTimestamp.timestamp,
        },
        select: {
            season: true,
            points: true,
            points_taken: true,
            points_max: true,
            status: true,
            introduction_order: true,
        },
    });

    // console.log('getCampaignData() | Campaign status:', campaignStatus);

    // Get all DefendEvent records for the latest timestamp
    const defendEvents = await prisma.defendEvent.findFirst({
        where: {
            timestamp: latestTimestamp.timestamp,
        },
        select: {
            season: true,
            event_id: true,
            start_time: true,
            end_time: true,
            region: true,
            enemy: true,
            points_max: true,
            points: true,
            status: true,
        },
    });

    // console.log('getCampaignData() | Defend events:', defendEvents);

    // Get all AttackEvent records for the latest timestamp
    const attackEvents = await prisma.attackEvent.findMany({
        where: {
            timestamp: latestTimestamp.timestamp,
        },
        select: {
            season: true,
            event_id: true,
            start_time: true,
            end_time: true,
            enemy: true,
            points_max: true,
            points: true,
            status: true,
            players_at_start: true,
            max_event_id: true,
        },
    });

    // console.log('getCampaignData() | Attack events:', attackEvents);

    //Get all Statistic records for the latest timestamp
    const statistics = await prisma.statistic.findMany({
        where: {
            timestamp: latestTimestamp.timestamp,
        },
        select: {
            season: true,
            season_duration: true,
            enemy: true,
            players: true,
            total_unique_players: true,
            missions: true,
            successful_missions: true,
            total_mission_difficulty: true,
            completed_planets: true,
            defend_events: true,
            successful_defend_events: true,
            attack_events: true,
            successful_attack_events: true,
            deaths: true,
            kills: true,
            accidentals: true,
            shots: true,
            hits: true,
        },
    });

    const response = {
        time: latestTimestamp.timestamp,
        error_code: 0,
        campaign_status: campaignStatus,
        defend_event: defendEvents,
        attack_events: attackEvents,
        statistics: statistics,
    };

    return response;
}
