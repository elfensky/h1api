// fetch
import axios from 'axios';
import https from 'https';
import FormData from 'form-data';
// db
import upsertStatus from '../prisma/func/upsertStatus.js';
import upsertDefendEvent from '../prisma/func/upsertDefendEvent.js';
import upsertAttackEvents from '../prisma/func/upsertAttackEvents.js';
import upsertStatistics from '../prisma/func/upsertStatistics.js';
import upsertAppData from '../prisma/func/upsertAppData.js';
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

export async function fetchStatusTEST() {
    // Get the current date and time
    const now = new Date();
    // Subtract one hour (3600000 milliseconds) from the current time
    const oneHourAgo = new Date(now.getTime() - 3600000);
    const oneHourFuture = new Date(now.getTime() + 3600000);
    const twoHoursAgo = new Date(now.getTime() - 7200000);
    const twoHoursFuture = new Date(now.getTime() + 7200000);
    // Get the timestamp (milliseconds since January 1, 1970)
    const timestampOneHourAgo = Math.floor(oneHourAgo.getTime() / 1000);
    const timestampOneHourFuture = Math.floor(oneHourFuture.getTime() / 1000);
    const timestampTwoHoursAgo = Math.floor(twoHoursAgo.getTime() / 1000);
    const timestampTwoHoursFuture = Math.floor(twoHoursFuture.getTime() / 1000);
    const timestampNow = Math.floor(now.getTime() / 1000);

    return {
        time: 1736626740,
        error_code: 0,
        campaign_status: [
            {
                points: 379270,
                season: 143,
                status: 'defeated',
                points_max: 379270,
                points_taken: 494447,
                introduction_order: 1,
            },
            {
                points: 595131,
                season: 143,
                status: 'active',
                points_max: 634640,
                points_taken: 618044,
                introduction_order: 0,
            },
            {
                points: 253910,
                season: 143,
                status: 'active',
                points_max: 253910,
                points_taken: 286801,
                introduction_order: 2,
            },
        ],
        defend_event: {
            enemy: 1,
            points: 3333,
            region: 7,
            season: 143,
            status: 'active', // active, success, fail
            end_time: timestampOneHourFuture,
            event_id: 4263,
            points_max: 5555,
            start_time: timestampOneHourAgo,
        },
        attack_events: [
            {
                enemy: 0,
                points: 29987,
                season: 143,
                status: 'success', // active, success, fail
                end_time: 1736599381,
                event_id: 851,
                points_max: 29987,
                start_time: 1736457902,
                max_event_id: 851,
                players_at_start: 319,
            },
            {
                enemy: 1,
                points: 26181,
                season: 143,
                status: 'fail',
                end_time: 1735853761,
                event_id: 848,
                points_max: 119778,
                start_time: 1735680961,
                max_event_id: 848,
                players_at_start: 557,
            },
            {
                enemy: 2,
                points: 7211,
                season: 143,
                status: 'active',
                end_time: 1736726761,
                event_id: 852,
                points_max: 25810,
                start_time: 1736553961,
                max_event_id: 852,
                players_at_start: 347,
            },
        ],
        statistics: [
            {
                hits: 81063516,
                enemy: 0,
                kills: 37807144,
                shots: 174240486,
                deaths: 775246,
                season: 143,
                players: 5,
                missions: 185527,
                accidentals: 188499,
                attack_events: 3,
                defend_events: 7,
                season_duration: 1540637,
                completed_planets: 30784,
                successful_missions: 112228,
                total_unique_players: 29527,
                successful_attack_events: 1,
                successful_defend_events: 2,
                total_mission_difficulty: 529101,
            },
            {
                hits: 71964344,
                enemy: 1,
                kills: 27938647,
                shots: 143441724,
                deaths: 584139,
                season: 143,
                players: 379,
                missions: 143046,
                accidentals: 141071,
                attack_events: 3,
                defend_events: 7,
                season_duration: 1540637,
                completed_planets: 30156,
                successful_missions: 87981,
                total_unique_players: 29527,
                successful_attack_events: 1,
                successful_defend_events: 2,
                total_mission_difficulty: 424423,
            },
            {
                hits: 40536205,
                enemy: 2,
                kills: 9443813,
                shots: 93358294,
                deaths: 352879,
                season: 143,
                players: 144,
                missions: 88965,
                accidentals: 67264,
                attack_events: 3,
                defend_events: 7,
                season_duration: 1540637,
                completed_planets: 15946,
                successful_missions: 52766,
                total_unique_players: 29527,
                successful_attack_events: 1,
                successful_defend_events: 2,
                total_mission_difficulty: 249610,
            },
        ],
    };
}

export default async function updateStatus(release) {
    const start = performance.now();

    try {
        const data = await fetchStatus();

        if (!data) {
            throw new Error('No data available', {
                cause: 'updates/updateCampaignStatus.js',
            });
        } else {
            const message =
                chalk.white('(1/7) START STATUS UPDATE ') +
                chalk.magenta('POST [get_campaign_status]') +
                chalk.yellow.underline('https://api.helldiversgame.com/1.0/') +
                chalk.white(' took ') +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms');
            log.info(message);

            const season = getSeasonFromStatus(data);

            const newStatus = await upsertStatus(season, data);

            const newDefendEvent = await upsertDefendEvent(season, data);

            const newAttackEvents = await upsertAttackEvents(season, data);

            const newStatistics = await upsertStatistics(season, data);

            const newAppData = await upsertAppData(season, release);

            if (!newStatus) {
                throw new Error(`Failed upsert: newStatus is falsy`, {
                    cause: 'updates/updateStatus.js',
                });
            }

            if (!newDefendEvent) {
                throw new Error(`Failed upsert: newDefendEvent is falsy`, {
                    cause: 'updates/updateStatus.js',
                });
            }

            if (!newAttackEvents) {
                throw new Error(`Failed upsert: newAttackEvents is falsy`, {
                    cause: 'updates/updateStatus.js',
                });
            }

            if (!newStatistics) {
                throw new Error(`Failed upsert: newStatistics is falsy`, {
                    cause: 'updates/updateStatus.js',
                });
            }

            if (!newAppData) {
                throw new Error(`Failed upsert: newAppData is falsy`, {
                    cause: 'updates/updateStatus.js',
                });
            }

            // only [newStatus] is used for the rebroadcast API.
            // [newDefendEvent, newAttackEvents] are used to update the current season's attack and defend events.
            // [newStatistics] are used for historic data
            const response = {
                time: newStatus.time,
                error_code: 0,
                campaign_status: newStatus.campaign_status,
                defend_event: newStatus.defend_event,
                attack_events: newStatus.attack_events,
                statistics: newStatus.statistics,
            };

            if (verifyStatus(data, response, season)) {
                const duration = performance.now() - start;

                log.info(
                    chalk.white('(7/7)') +
                        chalk.green(` UPDATED STATUS in `) +
                        chalk.blue(
                            (performance.now() - start).toFixed(3) + ' ms\n'
                        )
                );
            } else {
                throw new Error('Mismatch between API and DB', {
                    cause: 'updates/updateSeason.js',
                });
            }

            return response;
        }
    } catch (error) {
        log.error(chalk.red('(1/2) in ') + chalk.magenta(error.cause));
        log.error(chalk.red('(2/2) ' + error.stack));
    }
}
