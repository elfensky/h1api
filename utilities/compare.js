// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

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
        log.error(
            chalk.yellow('MISMATCH - TYPE: \n') +
                chalk.magenta(JSON.stringify(obj1)) +
                chalk.yellow('\n⬆️ api data | db data ⬇️ \n') +
                chalk.magenta(JSON.stringify(obj2))
        );
        return false;
    }

    // Get keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if they have the same number of keys
    if (keys1.length !== keys2.length) {
        log.error(
            chalk.yellow('MISMATCH - LENGTH>: \n') +
                chalk.magenta(JSON.stringify(obj1)) +
                chalk.yellow('\n⬆️ api data | db data ⬇️ \n') +
                chalk.magenta(JSON.stringify(obj2))
        );
        return false;
    }

    // Check if all keys and values are the same
    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            log.error(
                chalk.yellow('MISMATCH - KEYS: \n') +
                    chalk.magenta(JSON.stringify(obj1)) +
                    chalk.yellow('\n ⬆️ api data | db data ⬇️ \n') +
                    chalk.magenta(JSON.stringify(obj2))
            );
            return false;
        }
    }

    return true;
}

export function verify_new(apiData, dbData) {
    const start = performance.now();

    // Iterate over each key in the apiData object
    for (const key in apiData) {
        if (apiData.hasOwnProperty(key)) {
            // Check if the value for the current key is different in dbData
            if (deepEqual(apiData[key], dbData[key])) {
                console.log('DEBUG:');
                console.log(apiData[key]);
                console.log(dbData[key]);

                debugger;

                log.warn(
                    chalk.yellow(
                        `Mismatch for key "${key}": ` +
                            chalk.magenta(apiData[key]) +
                            ' (API) | ' +
                            chalk.magenta(dbData[key]) +
                            ' (DB)'
                    )
                );
                return false;
            }
        }
    }

    log.info(
        `Verification completed in ${chalk.blue(
            (performance.now() - start).toFixed(3)
        )} ms`
    );

    return true;
}

export function verify(apiData, dbData) {
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

export function verifySeason(apiData, dbData, season) {
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

    if (!deepEqual(apiData.introduction_order, dbData.introduction_order)) {
        // log.warn(
        //     'Mismatch between API and DB campaign_status: \n' +
        //         chalk.magenta(apiData.campaign_status) +
        //         '\n' +
        //         chalk.magenta(dbData.campaign_status)
        // );
        return false;
    }

    if (!deepEqual(apiData.points_max, dbData.points_max)) {
        // log.warn(
        //     'Mismatch between API and DB campaign_status: \n' +
        //         chalk.magenta(apiData.campaign_status) +
        //         '\n' +
        //         chalk.magenta(dbData.campaign_status)
        // );
        return false;
    }

    if (!deepEqual(apiData.snapshots, dbData.snapshots)) {
        // log.warn(
        //     'Mismatch between API and DB snapshots: \n' +
        //         chalk.magenta(JSON.stringify(apiData.snapshots[1])) +
        //         chalk.yellow('\n⬆️ api data | db data ⬇️ \n') +
        //         chalk.magenta(JSON.stringify(dbData.snapshots[1]))
        // );
        return false;
    }

    if (!deepEqual(apiData.defend_events, dbData.defend_events)) {
        // log.warn(
        //     'Mismatch between API and DB defend_event: \n' +
        //         chalk.magenta(JSON.stringify(apiData.defend_events[0])) +
        //         chalk.yellow('\n⬆️ api data | db data ⬇️ \n') +
        //         chalk.magenta(JSON.stringify(dbData.defend_events[0]))
        // );
        return false;
    }

    if (!deepEqual(apiData.attack_events, dbData.attack_events)) {
        // log.warn(
        //     'Mismatch between API and DB attack_events: \n' +
        //         chalk.magenta(JSON.stringify(apiData.attack_events[0])) +
        //         chalk.yellow('\n⬆️ api data | db data ⬇️ \n') +
        //         chalk.magenta(JSON.stringify(dbData.attack_events[0]))
        // );
        return false;
    }

    log.info(
        chalk.white(`(7/8) UPDATE SEASON `) +
            chalk.magenta(season) +
            chalk.white(`'s [verify()] in `) +
            chalk.blue((performance.now() - start).toFixed(3) + ' ms')
    );

    return true;
}
