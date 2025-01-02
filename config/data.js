//if no data is available, initialize the app from API
// fetch
import axios from 'axios';
import https from 'https';
import FormData from 'form-data';
// fetch
import { fetchStatus } from '../updates/updateStatus.js';
import updateSeason from '../updates/updateSeason.js';
// db
import getAppDataById from '../prisma/func/getAppDataById.js';
import upsertAppData from '../prisma/func/upsertAppData.js';
// helpers
import { verify } from '../utilities/compare.js';
import getSeasonFromStatus from '../utilities/getSeasonFromStatus.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

const release = 'helldivers1api@' + process.env.npm_package_version;

/* Check if app has appdata
 * If yes, return appdata
 * If no, fetch status
 * -> set appdata
 * -> set current season data
 * -> return appdata
 */

/*
 * the creation of api data needs to happen in the following order:
 * 1. the current season needs to be set in the app table
 * 2. the current season's snapshot needs to be fetched from the API
 * 3. the current season's status can then be fetched from the API with cron
 */

export default async function configureDATA(release) {
    const start = performance.now();

    try {
        log.info(chalk.white('(1/3) CHECKING APPDATA '));
        const appData = await getAppDataById(release);

        if (appData && !isMoreThanOneHourAgo(appData.last_updated)) {
            log.info(chalk.white('(2/3) APPDATA IS UP TO DATE'));
            log.info(chalk.green('(3/3) CONFIGURED APPDATA\n'));
            return appData;
        }

        if (appData && isMoreThanOneHourAgo(appData.last_updated)) {
            log.warn(
                chalk.white(`(2/3) APPDATA OUTDATED, FETCHING STATUS `) +
                    chalk.blue((performance.now() - start).toFixed(3) + ' ms')
            );
        }

        if (!appData) {
            log.warn(chalk.white('(2/3) NO APPDATA FOUND, FETCHING STATUS '));
        }

        const data = await fetchStatus(); // get API data so we can set current season
        const season = getSeasonFromStatus(data);

        const newAppData = await upsertAppData(season, release);

        if (!newAppData) {
            log.error(chalk.red('(3/3) UNABLE TO INITIALIZE APPDATA\n'));
        }

        const newSeason = await updateSeason(season);

        if (!newSeason) {
            log.error(chalk.red('(3/3) UNABLE TO INITIALIZE NEWSEASONS\n'));
        }

        if (!newAppData || !newSeason) {
            throw new Error('UNABLE TO INITIALIZE APPLICATION, QUITTING...', {
                cause: 'config/data.js',
            });
        } else {
            log.info(chalk.green('(3/3) APPDATA UPDATED\n'));
            return newAppData;
        }
    } catch (error) {
        log.error(chalk.red('(1/2) in ') + chalk.magenta(error.cause));
        log.error(chalk.red('(2/2) ' + error.stack));

        if (error.message === 'UNABLE TO INITIALIZE APPLICATION, QUITTING...') {
            process.exit(1);
        }
    }
}

function isMoreThanOneHourAgo(givenTime) {
    // Get the current time in milliseconds
    const now = Date.now();

    // Calculate the time one hour ago
    const oneHourAgo = now - 1 * 60 * 60 * 1000;

    // Compare the given time with the time one hour ago
    return givenTime < oneHourAgo;
}
