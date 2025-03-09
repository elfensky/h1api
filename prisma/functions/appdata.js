import prisma from '../prisma.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

export async function upsertAppData(season, release) {
    const start = performance.now();
    const now = new Date();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 1);

    try {
        const existingRecord = await prisma.appdata.findUnique({
            where: {
                id: release,
            },
        });

        const upsertRecord = await prisma.appdata.upsert({
            where: {
                id: release,
            },
            update: {
                active_season: season,
                active_date: today,
                last_updated: now,
            },
            create: {
                id: release,
                active_season: season,
                active_date: today,
                last_updated: now,
            },
        });

        const action = existingRecord ? 'UPDATED' : 'CREATED';

        log.info(
            chalk.white(`(3/4) ${action} APPDATA `) +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );

        return upsertRecord; // Return the newly created event
    } catch (error) {
        throw error;
    }
}

export async function updateAppData(data, release) {
    const start = performance.now();
    const now = new Date();

    try {
        const updateRecord = await prisma.appdata.update({
            where: {
                id: release,
            },
            data: {
                active_season: data.season,
                active_date: data.active_day,
                last_updated: now,
            },
        });

        // log.info(
        // chalk.white(`(3/4) ${action} APPDATA `) +
        // chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        // );

        return updateRecord; // Return the newly created event
    } catch (error) {
        throw error;
    }
}

export async function getAppDataById(id) {
    const start = performance.now();

    try {
        // Retrieve the app data by ID
        const appData = await prisma.appdata.findUnique({
            where: {
                id: id,
            },
        });

        return appData;
    } catch (error) {
        log.error(chalk.red('Error retrieving app data:'), error);
        throw error; // Re-throw the error after logging it
    }
}

export async function getAppData() {
    const start = performance.now();

    try {
        // Retrieve the app data by ID
        const appData = await prisma.appdata.findFirst({
            orderBy: {
                last_updated: 'desc',
            },
        });

        return appData;
    } catch (error) {
        log.error(chalk.red('Error retrieving app data:'), error);
        throw error; // Re-throw the error after logging it
    }
}
