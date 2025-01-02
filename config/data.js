//if no data is available, initialize the app from API
// fetch
import axios from 'axios';
import https from 'https';
import FormData from 'form-data';
// fetch
// import { fetchStatus } from '../updates/updateSeason.js';
// import updateSeason from '../updates/updateSeason.js';
// db
import upsertAppData from '../prisma/func/upsertAppData.js';
// helpers
import { verifyStatus } from '../utilities/compare.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

const release = 'helldivers1api@' + process.env.npm_package_version;

//
//fetch status
// -> set app current season

//fetch season
// -> set season data for active season

/*
 * the creation of api data needs to happen in the following order:
 * 1. the current season needs to be set in the app table
 * 2. the current season's snapshot needs to be fetched from the API
 * 3. the current season's status can then be fetched from the API with cron
 */

export default async function configureDATA() {
    const start = performance.now();
    console.log('configureDATA()');

    try {
        const status = await fetchStatus();
        const season = await fetchSeason(status.campaign_status[0].season);

        if (!status) {
            throw new Error('No data available', {
                cause: 'updates/initializeData.js',
            });
        }
    } catch (error) {
        log.error(chalk.red('(1/2) in ') + chalk.magenta(error.cause));
        log.error(chalk.red('(2/2) ' + error.stack));
    }
}
