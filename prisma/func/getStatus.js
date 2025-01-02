import prisma from '../prisma.js';

export default async function getStatus() {
    const data = await prisma.status.findFirst({
        orderBy: {
            time: 'desc', // Sort by the timestamp field in descending order
        },
    });

    if (!data) {
        throw new Error('No status found in database.');
    }

    const response = {
        time: data.time,
        error_code: 0,
        campaign_status: data.campaign_status,
        defend_event: data.defend_event,
        attack_events: data.attack_events,
        statistics: data.statistics,
    };

    return response;
}
