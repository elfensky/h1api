import prisma from '../prisma.js';
import getActiveSeason from './getActiveSeason.js';

export default async function getDefendEvent() {
    const activeSeason = await getActiveSeason();

    // Get DefendEvent by season and order by time DESC
    const defendEvent = await prisma.defend_events.findFirst({
        where: {
            season: activeSeason,
        },
        orderBy: {
            start_time: 'desc',
        },
    });

    if (!defendEvent) {
        throw new Error('No defendEvent found in database.');
    }

    return defendEvent;
}
