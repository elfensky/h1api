import prisma from '../prisma.js';
import getActiveSeason from './getActiveSeason.js';

export default async function getAttackEvent() {
    const activeSeason = await getActiveSeason();

    // Get DefendEvent by season and order by time DESC
    const attackEvent = await prisma.attack_events.findFirst({
        where: {
            season: activeSeason,
        },
        orderBy: {
            start_time: 'desc',
        },
    });

    if (!attackEvent) {
        throw new Error('No attackEvent found in database.');
    }

    return attackEvent;
}
