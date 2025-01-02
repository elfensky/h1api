import prisma from '../prisma.js';

export default async function getSeason(season) {
    // Get latest Timestamp record
    const existingSeason = await prisma.season.findUnique({
        where: {
            season: season, // Sort by the timestamp field in descending order
        },
    });

    if (!existingSeason) {
        return null;
    }

    const existingIntroOrder = await prisma.introduction_order.findUnique({
        where: {
            season: season,
        },
    });

    if (!existingIntroOrder) {
        return null;
    }

    const existingPointsMax = await prisma.points_max.findUnique({
        where: {
            season: season,
        },
    });

    if (!existingPointsMax) {
        return null;
    }

    const existingSnapshots = await prisma.snapshots.findMany({
        where: {
            season: season,
        },
        select: {
            time: true,
            data: true,
        },
    });

    if (!existingSnapshots) {
        return null;
    }

    const existingDefendEvents = await prisma.defend_events.findMany({
        where: {
            season: season,
        },
        select: {
            event_id: true,
            start_time: true,
            end_time: true,
            region: true,
            enemy: true,
            points_max: true,
            points: true,
            status: true,
            players_at_start: true,
        },
    });

    if (!existingDefendEvents) {
        return null;
    }

    const existingAttackEvents = await prisma.attack_events.findMany({
        where: {
            season: season,
        },
        select: {
            event_id: true,
            start_time: true,
            end_time: true,
            enemy: true,
            points_max: true,
            points: true,
            status: true,
            players_at_start: true,
        },
    });

    if (!existingAttackEvents) {
        return null;
    }

    const response = {
        time: existingSeason.time,
        error_code: 0,
        introduction_order: existingIntroOrder.json,
        points_max: existingPointsMax.json,
        snapshots: existingSnapshots,
        defend_events: existingDefendEvents,
        attack_events: existingAttackEvents,
    };

    return response;
}
