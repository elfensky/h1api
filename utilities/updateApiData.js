//fetch
import fetchCampaignStatus from './fetchCampaignStatus.js';
//db
import saveTimestamp from '../prisma/functions/saveTimestamp.js';
import saveCampaignStatus from '../prisma/functions/saveCampaignStatus.js';
import saveDefendEvent from '../prisma/functions/saveDefendEvent.js';
import saveAttackEvent from '../prisma/functions/saveAttackEvent.js';
import saveStatistics from '../prisma/functions/saveStatistics.js';
import getRebroadcast from '../prisma/functions/getRebroadcast.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import getLogger from './logger.js';
import chalk from 'chalk';
const log = getLogger();

export default async function updateApiData() {
    const start = performance.now();
    const data = await fetchCampaignStatus();

    if (data) {
        const message =
            chalk.white('UPDATE - ') +
            chalk.yellow('GET https://api.helldiversgame.com/1.0/') +
            chalk.white(' took ') +
            chalk.blue((performance.now() - start).toFixed(3) + ' ms');
        log.info(message);

        const timestamp = await saveTimestamp(data);
        const epoch = Math.floor(timestamp.timestamp.getTime() / 1000);

        if (epoch === data.time) {
            const campaignStatus = await saveCampaignStatus(data);
            const defendEvent = await saveDefendEvent(data);
            const attackEvents = await saveAttackEvent(data);
            const statistics = await saveStatistics(data);

            const response = {
                time: epoch,
                error_code: 0,
                campaign_status: campaignStatus,
                defend_event: defendEvent,
                attack_events: attackEvents,
                statistics: statistics,
            };

            if (verify(data, response)) {
                const duration = performance.now() - start;
                log.info(
                    chalk.green('UPDATE - SUCCESS in ') +
                        chalk.blue(duration.toFixed(3)) +
                        chalk.green(' ms')
                );
            } else {
                log.warn(chalk.yellow('Mismatch between API and DB'));
            }
        }
    } else {
        log.error(
            chalk.red('failed to fetch campaign status from official API')
        );
    }
}

function verify(apiData, dbData) {
    const start = performance.now();

    if (apiData.time !== dbData.time) {
        log.warn(
            'Mismatch between API and DB timestamps: ' +
                chalk.magenta(apiData.time) +
                ' | ' +
                chalk.magenta(dbData.time)
        );
        return false;
    }

    if (!deepEqual(apiData.campaign_status, dbData.campaign_status)) {
        log.warn(
            'Mismatch between API and DB campaign_status: \n' +
                chalk.magenta(apiData.campaign_status) +
                '\n' +
                chalk.magenta(dbData.campaign_status)
        );
        return false;
    }

    if (!deepEqual(apiData.defend_event, dbData.defend_event)) {
        log.warn(
            'Mismatch between API and DB defend_event: \n' +
                chalk.magenta(apiData.defend_event) +
                '\n' +
                chalk.magenta(dbData.defend_event)
        );
        return false;
    }

    if (!deepEqual(apiData.attack_events, dbData.attack_events)) {
        log.warn(
            'Mismatch between API and DB attack_events: \n' +
                chalk.magenta(apiData.attack_events) +
                '\n' +
                chalk.magenta(dbData.attack_events)
        );
        return false;
    }

    if (!deepEqual(apiData.statistics, dbData.statistics)) {
        log.warn(
            'Mismatch between API and DB statistics: \n' +
                chalk.magenta(apiData.statistics) +
                '\n' +
                chalk.magenta(dbData.statistics)
        );
        return false;
    }
    const duration = performance.now() - start;
    log.info(
        chalk.white('UPDATE - verify() in ') +
            chalk.blue(duration.toFixed(3) + ' ms')
    );
    return true;
}

function deepEqual(obj1, obj2) {
    // Check if both are the same reference
    if (obj1 === obj2) {
        return true;
    }

    // Check if both are objects
    if (
        typeof obj1 !== 'object' ||
        obj1 === null ||
        typeof obj2 !== 'object' ||
        obj2 === null
    ) {
        return false;
    }

    // Get keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if they have the same number of keys
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Check if all keys and values are the same
    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}
