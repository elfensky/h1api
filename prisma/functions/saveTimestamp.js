import prisma from '../prisma.js';

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
            const newEvent = await prisma.timestamp.create({
                data: {
                    timestamp: data.time,
                },
            });
            console.log(
                'saveTimestamp() | saved new timestamp with id:',
                data.time
            );
            return newEvent; // Return the newly created event
        } else {
            console.log(
                `saveTimestamp() | timestamp ${data.time} already exists.`
            );
            return existingEvent; // Optionally return the existing event
        }
    } catch (error) {
        console.error(
            `saveTimestamp() | Failed to save timestamp with id: ${data.time}`,
            error
        );
        throw error; // Re-throw the error if you want to handle it upstream
    }
}

export default saveTimestamp;
