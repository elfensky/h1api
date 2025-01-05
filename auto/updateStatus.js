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
    return {
        time: 1735688342,
        error_code: 0,
        campaign_status: [
            {
                season: 143,
                points: 300271,
                points_taken: 199471,
                points_max: 379270,
                status: 'active',
                introduction_order: 1,
            },
            {
                season: 143,
                points: 634640,
                points_taken: 318069,
                points_max: 634640,
                status: 'active',
                introduction_order: 0,
            },
            {
                season: 143,
                points: 138534,
                points_taken: 142913,
                points_max: 253910,
                status: 'active',
                introduction_order: 2,
            },
        ],
        defend_event: {
            season: 143,
            event_id: 4009,
            start_time: 1735939579,
            end_time: 1736089979,
            region: 3,
            enemy: 0,
            points_max: 4321,
            points: 4321,
            status: 'success', // active, success, failure
        },
        attack_events: [
            {
                season: 143,
                event_id: 2002,
                start_time: 1735859071,
                end_time: 1735959071,
                enemy: 0,
                points_max: 200,
                points: 200,
                status: 'success',
                players_at_start: 555,
            },
            {
                season: 143,
                event_id: 2001,
                start_time: 1735989071,
                end_time: 1735959071,
                enemy: 2,
                points_max: 1000,
                points: 800,
                status: 'failure',
                players_at_start: 555,
            },
        ],
        statistics: [
            {
                season: 143,
                season_duration: 602296,
                enemy: 0,
                players: 281,
                total_unique_players: 17033,
                missions: 77251,
                successful_missions: 47456,
                total_mission_difficulty: 209314,
                completed_planets: 13593,
                defend_events: 2,
                successful_defend_events: 0,
                attack_events: 1,
                successful_attack_events: 0,
                deaths: 307392,
                kills: 15173254,
                accidentals: 74751,
                shots: 68723104,
                hits: 31754072,
            },
            {
                season: 143,
                season_duration: 602296,
                enemy: 1,
                players: 137,
                total_unique_players: 17033,
                missions: 71389,
                successful_missions: 46005,
                total_mission_difficulty: 199218,
                completed_planets: 17306,
                defend_events: 2,
                successful_defend_events: 0,
                attack_events: 1,
                successful_attack_events: 0,
                deaths: 263947,
                kills: 13519119,
                accidentals: 65109,
                shots: 67759318,
                hits: 33550837,
            },
            {
                season: 143,
                season_duration: 602296,
                enemy: 2,
                players: 80,
                total_unique_players: 17033,
                missions: 43429,
                successful_missions: 26198,
                total_mission_difficulty: 117596,
                completed_planets: 8300,
                defend_events: 2,
                successful_defend_events: 0,
                attack_events: 1,
                successful_attack_events: 0,
                deaths: 164548,
                kills: 4466720,
                accidentals: 31568,
                shots: 43600094,
                hits: 18915007,
            },
        ],
    };
}

export default async function updateStatus(release) {
    const start = performance.now();

    try {
        const data = await fetchStatusTEST();

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
                    chalk.green(`(7/7) UPDATED STATUS in `) +
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
