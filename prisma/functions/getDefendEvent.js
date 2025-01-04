import prisma from '../prisma.js';

export default async function findDefendEventLatest() {
    // Get latest Timestamp record
    const latestTimestamp = await prisma.timestamp.findFirst({
        orderBy: {
            timestamp: 'desc', // Sort by the timestamp field in descending order
        },
    });

    if (!latestTimestamp) {
        throw new Error('No timestamp found in database.');
    }

    // Get all DefendEvent records for the latest timestamp
    const defendEvent = await prisma.defendEvent.findFirst({
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

    if (!defendEvent) {
        throw new Error(
            `No defendEvent linked to ${latestTimestamp} found in database.`
        );
    }

    const response = {
        ...defendEvent,
    };

    return response;
}
