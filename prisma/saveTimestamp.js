import prisma from './prisma.js';

async function saveTimestamp(data) {
    try {
        // Check if a defendEvent with the same timestamp already exists
        const existingEvent = await prisma.timestamp.findUnique({
            where: {
                timestamp: data.time,
            },
        });

        if (!existingEvent) {
            // If it doesn't exist, create a new defendEvent
            await prisma.defendEvent.create({
                data: {
                    timestamp: data.time,
                },
            });
            console.log('saved new timestamp with id:', data.time);
        } else {
            console.log(`timestamp ${data.time} already exists.`);
        }
    } catch (error) {
        console.error(`Failed to save timestamp with id: ${data.time}`, error);
    }
}

export default saveTimestamp;
