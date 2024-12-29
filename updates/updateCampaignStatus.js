//fetch
import axios from 'axios';
import https from 'https';
import FormData from 'form-data';
//db
// import saveTimestamp from '../prisma/functions/saveTimestamp.js';
// import saveCampaignStatus from '../prisma/functions/saveCampaignStatus.js';
// import saveDefendEvent from '../prisma/functions/saveDefendEvent.js';
// import saveAttackEvent from '../prisma/functions/saveAttackEvent.js';
// import saveStatistics from '../prisma/functions/saveStatistics.js';
// import getRebroadcast from '../prisma/functions/getRebroadcast.js';
// import createStatus from '../prisma/func/createStatus.js';
//helpers
import { verify } from '../utilities/compare.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

async function fetchCampaignStatus() {
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

async function fetchCampaignStatusTEST() {
    return {
        time: 1735573365,
        error_code: 0,
        campaign_status: [
            {
                season: 143,
                points: 379270,
                points_taken: 193435,
                points_max: 379270,
                status: 'active',
                introduction_order: 1,
            },
            {
                season: 143,
                points: 586808,
                points_taken: 269488,
                points_max: 634640,
                status: 'active',
                introduction_order: 0,
            },
            {
                season: 143,
                points: 113019,
                points_taken: 117398,
                points_max: 253910,
                status: 'active',
                introduction_order: 2,
            },
        ],
        defend_event: {
            season: 143,
            event_id: 4245,
            start_time: 1735410602,
            end_time: 1735418221,
            region: 3,
            enemy: 2,
            points_max: 1756,
            points: 1756,
            status: 'success',
        },
        attack_events: [
            {
                season: 143,
                event_id: 847,
                start_time: 1735505161,
                end_time: 1735677961,
                enemy: 0,
                points_max: 82199,
                points: 18745,
                status: 'active',
                players_at_start: 640,
                max_event_id: 847,
            },
            {
                season: 141,
                event_id: 843,
                start_time: 1730600402,
                end_time: 1730773202,
                enemy: 1,
                points_max: 58706,
                points: 26169,
                status: 'fail',
                players_at_start: 273,
                max_event_id: 843,
            },
            {
                season: 142,
                event_id: 846,
                start_time: 1733712241,
                end_time: 1733869982,
                enemy: 2,
                points_max: 23413,
                points: 23413,
                status: 'success',
                players_at_start: 332,
                max_event_id: 846,
            },
        ],
        statistics: [
            {
                season: 143,
                season_duration: 487276,
                enemy: 0,
                players: 307,
                total_unique_players: 14451,
                missions: 62019,
                successful_missions: 39256,
                total_mission_difficulty: 166185,
                completed_planets: 13281,
                defend_events: 7,
                successful_defend_events: 2,
                attack_events: 1,
                successful_attack_events: 0,
                deaths: 241033,
                kills: 11910298,
                accidentals: 58486,
                shots: 53940388,
                hits: 24815011,
            },
            {
                season: 143,
                season_duration: 487276,
                enemy: 1,
                players: 270,
                total_unique_players: 14451,
                missions: 60175,
                successful_missions: 39259,
                total_mission_difficulty: 166888,
                completed_planets: 14803,
                defend_events: 7,
                successful_defend_events: 2,
                attack_events: 1,
                successful_attack_events: 0,
                deaths: 216709,
                kills: 11281983,
                accidentals: 53933,
                shots: 55966375,
                hits: 27637142,
            },
            {
                season: 143,
                season_duration: 487276,
                enemy: 2,
                players: 146,
                total_unique_players: 14451,
                missions: 35660,
                successful_missions: 21580,
                total_mission_difficulty: 97902,
                completed_planets: 6676,
                defend_events: 7,
                successful_defend_events: 2,
                attack_events: 1,
                successful_attack_events: 0,
                deaths: 134066,
                kills: 3673732,
                accidentals: 25841,
                shots: 35906670,
                hits: 15589830,
            },
        ],
    };
}

export default async function updateCampaignStatus() {
    const start = performance.now();

    try {
        const data = await fetchCampaignStatusTEST();
        if (data) {
            const message =
                chalk.white('UPDATE - ') +
                chalk.yellow('GET https://api.helldiversgame.com/1.0/') +
                chalk.white(' took ') +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms');
            log.info(message);

            const status = await createStatus(data);
            const epoch = Math.floor(timestamp.timestamp.getTime() / 1000);

            if (epoch === data.time) {
                // const campaignStatus = await saveCampaignStatus(data);
                // const defendEvent = await saveDefendEvent(data);
                // const attackEvents = await saveAttackEvent(data);
                // const statistics = await saveStatistics(data);
                // const response = {
                //     time: epoch,
                //     error_code: 0,
                //     campaign_status: campaignStatus,
                //     defend_event: defendEvent,
                //     attack_events: attackEvents,
                //     statistics: statistics,
                // };
                // if (verify(data, response)) {
                //     const duration = performance.now() - start;
                //     log.info(
                //         chalk.green('UPDATE - SUCCESS in ') +
                //             chalk.blue(duration.toFixed(3)) +
                //             chalk.green(' ms')
                //     );
                // } else {
                //     log.warn(chalk.yellow('Mismatch between API and DB'));
                // }
                log.info(chalk.green('updateCampaignStatus() SUCCESS'));
            }
        } else {
            throw new Error('No data available', {
                cause: 'updateCampaignStatus()',
            });
        }
    } catch (error) {
        log.error(chalk.red('(1/2) in ') + chalk.magenta(error.cause));
        log.error(chalk.red('(2/2) ' + error.stack));
    }
}
