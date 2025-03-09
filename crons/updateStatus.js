// fetch
import axios from 'axios';
import https from 'https';
import FormData from 'form-data';
// db
import upsertStatus from '../prisma/func/upsertStatus.js';
// import upsertDefendEvent from '../prisma/func/upsertDefendEvent.js';
// import upsertAttackEvents from '../prisma/func/upsertAttackEvents.js';
// import upsertStatistics from '../prisma/func/upsertStatistics.js';

import {
    getAppData,
    updateAppData,
    upsertAppData,
} from '../prisma/functions/appdata.js';
// helpers
import { verifyStatus } from '../utilities/compare.js';
import getSeasonFromStatus from '../utilities/getSeasonFromStatus.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

export async function fetchStatus() {
    // The API URL you want to ping
    const url = 'https://api.helldiversgame.com/1.0/';
    const form = new FormData();
    form.append('action', 'get_campaign_status');

    const agent = new https.Agent({
        rejectUnauthorized: false,
    });

    try {
        // Make the POST request
        const response = await axios.post(url, form, {
            httpsAgent: agent,
            headers: {
                ...form.getHeaders(), // Set the correct headers for form data
            },
        });

        // Access the response data
        const data = response.data;

        if (!data) {
            throw new Error('Failed to parse response from axios', {
                cause: 'fetchCampaignStatus()',
            });
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export default async function updateStatus(release) {
    const start = performance.now();

    try {
        const data = await fetchStatus();

        if (!data) {
            throw new Error('No data available', {
                cause: 'crons/updateStatus.js',
            });
        } else {
            const message =
                chalk.white('(1/7) START STATUS UPDATE ') +
                chalk.magenta('POST [get_campaign_status] ') +
                chalk.yellow.underline('https://api.helldiversgame.com/1.0/') +
                chalk.white(' took ') +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms');
            log.info(message);

            const season = getSeasonFromStatus(data);

            const newStatus = await upsertStatus(season, data);

            // const newDefendEvent = await upsertDefendEvent(season, data);

            // const newAttackEvents = await upsertAttackEvents(season, data);

            // const newStatistics = await upsertStatistics(season, data);

            // const newAppData = await upsertAppData(season, release);

            // if (!newStatus) {
            //     throw new Error(`Failed upsert: newStatus is falsy`, {
            //         cause: 'updates/updateStatus.js',
            //     });
            // }

            // if (!newDefendEvent) {
            //     throw new Error(`Failed upsert: newDefendEvent is falsy`, {
            //         cause: 'updates/updateStatus.js',
            //     });
            // }

            // if (!newAttackEvents) {
            //     throw new Error(`Failed upsert: newAttackEvents is falsy`, {
            //         cause: 'updates/updateStatus.js',
            //     });
            // }

            // if (!newStatistics) {
            //     throw new Error(`Failed upsert: newStatistics is falsy`, {
            //         cause: 'updates/updateStatus.js',
            //     });
            // }

            // if (!newAppData) {
            //     throw new Error(`Failed upsert: newAppData is falsy`, {
            //         cause: 'updates/updateStatus.js',
            //     });
            // }

            // only [newStatus] is used for the rebroadcast API.
            // [newDefendEvent, newAttackEvents] are used to update the current season's attack and defend events.
            // [newStatistics] are used for historic data

            // const response = {
            //     time: newStatus.time,
            //     error_code: 0,
            //     campaign_status: newStatus.campaign_status,
            //     defend_event: newStatus.defend_event,
            //     attack_events: newStatus.attack_events,
            //     statistics: newStatus.statistics,
            // };

            // if (verifyStatus(data, response, season)) {
            //     const duration = performance.now() - start;

            //     log.info(
            //         chalk.white('(7/7)') +
            //             chalk.green(` UPDATED STATUS in `) +
            //             chalk.blue(
            //                 (performance.now() - start).toFixed(3) + ' ms\n'
            //             )
            //     );
            // } else {
            //     throw new Error('Mismatch between API and DB', {
            //         cause: 'updates/updateSeason.js',
            //     });
            // }

            // return response;
        }
    } catch (error) {
        log.error(chalk.red('(1/2) in ') + chalk.magenta(error.cause));
        log.error(chalk.red('(2/2) ' + error.stack));
    }
}
