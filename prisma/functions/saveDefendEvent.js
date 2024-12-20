import prisma from '../prisma.js';

async function saveDefendEvent(data) {
    try {
        // Ensure that the timestamp exists in the Timestamp table
        const existingTimestamp = await prisma.timestamp.findUnique({
            where: { timestamp: data.time },
        });

        if (!existingTimestamp) {
            throw new Error(
                `saveDefentEvent() | Timestamp ${data.time} does not exist.`
            );
        }

        const newDefendEvent = await prisma.defendEvent.create({
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
        // console.log('saveDefentEvent() | Defend event saved successfully.');
        throw new Error('saveDefentEvent() | Defend event FAILED TEST');
        // return newDefendEvent;
    } catch (error) {
        console.error(
            'saveDefentEvent() | Failed to save defend event:',
            error
        );
    }
}

export default saveDefendEvent;
