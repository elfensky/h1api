import prisma from './prisma.js';

async function savedefendEvent(data) {
    try {
        await prisma.defendEvent.create({
            data: {
                timestamp: data.time, // Assuming start_time is used as a unique identifier
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
        console.log('Defend event saved successfully.');
    } catch (error) {
        console.error('Failed to save defend event:', error);
    }
}

export default savedefendEvent;
