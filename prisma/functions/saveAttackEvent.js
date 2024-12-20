import prisma from './prisma.js';

async function saveAttackEvent(data) {
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

        const newAttackEventArray = [];

        for (const event of data.attack_events) {
            const newAttackEvent = await prisma.attackEvent.create({
                data: {
                    timestamp: data.time,
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
            newAttackEventArray.push(newAttackEvent);
        }
        console.log('newAttackEvent() | Campaign event saved successfully.');
        return newAttackEventArray;
    } catch (error) {
        console.error(
            'newAttackEvent() | Failed to save campaign event:',
            error
        );
    }
}

export default saveAttackEvent;
