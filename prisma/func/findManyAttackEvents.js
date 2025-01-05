import prisma from '../prisma.js';
import getActiveSeason from './getActiveSeason.js';

export default async function findManyAttackEvents() {
    const activeSeason = await getActiveSeason();

    // Get DefendEvent by season and order by time DESC
    const list = await prisma.attack_events.findMany({
        where: {
            season: activeSeason,
        },
        orderBy: {
            event_id: 'desc',
        },
    });

    // if (!list || list.length === 0) {
    //     throw new Error('No active attackEvents found in database.');
    // } //this will be handled higher up.

    return list;
}
