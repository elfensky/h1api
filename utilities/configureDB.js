import prisma from '../prisma/prisma.js';

export default async function configureDB() {
    const currentMode = await prisma.$queryRaw`PRAGMA journal_mode;`;
    console.log('Current journal mode:', currentMode);

    // If the current mode is not WAL, set it to WAL
    if (currentMode[0].journal_mode !== 'wal') {
        const result = await prisma.$queryRaw`PRAGMA journal_mode = WAL;`;
        console.log('Journal mode set to:', result);
    } else {
        console.log('Journal mode is already set to WAL.');
    }
}
