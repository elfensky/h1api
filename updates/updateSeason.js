// fetch
import axios from 'axios';
import https from 'https';
import FormData from 'form-data';
// db
import upsertSeason from '../prisma/func/upsertSeason.js';
import upsertIntroductionOrder from '../prisma/func/upsertIntroductionOrder.js';
import upsertPointsMax from '../prisma/func/upsertPointsMax.js';
import upsertSnapshots from '../prisma/func/upsertSnapshots.js';
import upsertDefendEvents from '../prisma/func/upsertDefendEvents.js';
import upsertAttackEvents from '../prisma/func/upsertAttackEvents.js';
// helpers
import { verifySeason } from '../utilities/compare.js';
// logs, monitoring, etc
import { performance } from 'perf_hooks';
import { getLogger } from '../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

async function fetchSeason(season) {
    if (!season) {
        throw new Error('season parameter is required', {
            cause: 'fetchSeason()',
        });
    }

    if (typeof season !== 'number' || season < 1) {
        throw new Error('season parameter must be a positive integer', {
            cause: 'fetchSeason()',
        });
    }
    // The API URL you want to ping
    const url = 'https://api.helldiversgame.com/1.0/';
    const form = new FormData();
    form.append('action', 'get_snapshots');
    form.append('season', season.toString());

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
                cause: 'fetchSeason()',
            });
        }

        return data;
    } catch (error) {
        throw error;
    }
}

async function fetchSeasonTEST(season) {
    return {
        time: 1735689365,
        error_code: 0,
        introduction_order: [1, 0, 2],
        points_max: [379270, 634640, 253910],
        snapshots: [
            {
                season: 143,
                time: 1735086045,
                data: '[{"points":189635,"points_taken":0,"status":"hidden"},{"points":317320,"points_taken":0,"status":"active"},{"points":126955,"points_taken":0,"status":"hidden"}]',
            },
            {
                season: 143,
                time: 1735171201,
                data: '[{"points":189635,"points_taken":0,"status":"hidden"},{"points":416812,"points_taken":99492,"status":"active"},{"points":126955,"points_taken":0,"status":"hidden"}]',
            },
            {
                season: 143,
                time: 1735257601,
                data: '[{"points":189635,"points_taken":0,"status":"hidden"},{"points":466866,"points_taken":149546,"status":"active"},{"points":117453,"points_taken":41280,"status":"active"}]',
            },
            {
                season: 143,
                time: 1735344001,
                data: '[{"points":261730,"points_taken":72095,"status":"active"},{"points":498537,"points_taken":181217,"status":"active"},{"points":137968,"points_taken":61795,"status":"active"}]',
            },
            {
                season: 143,
                time: 1735430401,
                data: '[{"points":323801,"points_taken":134166,"status":"active"},{"points":532482,"points_taken":215162,"status":"active"},{"points":79326,"points_taken":83705,"status":"active"}]',
            },
            {
                season: 143,
                time: 1735516801,
                data: '[{"points":379270,"points_taken":191984,"status":"active"},{"points":567621,"points_taken":250301,"status":"active"},{"points":103005,"points_taken":107384,"status":"active"}]',
            },
            {
                season: 143,
                time: 1735603201,
                data: '[{"points":379270,"points_taken":193827,"status":"active"},{"points":601199,"points_taken":283879,"status":"active"},{"points":119529,"points_taken":123908,"status":"active"}]',
            },
        ],
        defend_events: [
            {
                season: 143,
                event_id: 4239,
                start_time: 1735224781,
                end_time: 1735233781,
                region: 7,
                enemy: 2,
                points_max: 3044,
                points: 1761,
                status: 'fail',
                players_at_start: 656,
            },
            {
                season: 143,
                event_id: 4240,
                start_time: 1735233841,
                end_time: 1735242841,
                region: 6,
                enemy: 2,
                points_max: 2136,
                points: 1639,
                status: 'fail',
                players_at_start: 585,
            },
            {
                season: 143,
                event_id: 4241,
                start_time: 1735242901,
                end_time: 1735251121,
                region: 5,
                enemy: 2,
                points_max: 1830,
                points: 1830,
                status: 'success',
                players_at_start: 569,
            },
            {
                season: 143,
                event_id: 4242,
                start_time: 1735383421,
                end_time: 1735392421,
                region: 6,
                enemy: 2,
                points_max: 1649,
                points: 1604,
                status: 'fail',
                players_at_start: 471,
            },
            {
                season: 143,
                event_id: 4243,
                start_time: 1735392481,
                end_time: 1735401481,
                region: 5,
                enemy: 2,
                points_max: 2332,
                points: 1652,
                status: 'fail',
                players_at_start: 678,
            },
            {
                season: 143,
                event_id: 4244,
                start_time: 1735401541,
                end_time: 1735410541,
                region: 4,
                enemy: 2,
                points_max: 2686,
                points: 1575,
                status: 'fail',
                players_at_start: 917,
            },
            {
                season: 143,
                event_id: 4245,
                start_time: 1735410602,
                end_time: 1735418221,
                region: 3,
                enemy: 2,
                points_max: 1756,
                points: 1756,
                status: 'success',
                players_at_start: 758,
            },
            {
                season: 143,
                event_id: 4246,
                start_time: 1735678021,
                end_time: 1735687021,
                region: 9,
                enemy: 0,
                points_max: 3010,
                points: 838,
                status: 'fail',
                players_at_start: 588,
            },
        ],
        attack_events: [
            {
                season: 143,
                event_id: 847,
                start_time: 1735505161,
                end_time: 1735677961,
                enemy: 0,
                points_max: 82199,
                points: 48988,
                status: 'fail',
                players_at_start: 640,
            },
        ],
    };
}

export default async function updateSeason(season) {
    const start = performance.now();

    try {
        const data = await fetchSeason(season);

        if (!data) {
            throw new Error('No data available', {
                cause: 'updates/updateSeason.js',
            });
        } else {
            const message =
                chalk.gray('(1/6) START UPDATE SEASON ') +
                chalk.yellow(
                    `POST [get_snapshots] [${season}] https://api.helldiversgame.com/1.0/`
                ) +
                chalk.white(' took ') +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms');
            log.info(message);

            const newSeason = await upsertSeason(season, data);

            if (!newSeason) {
                throw new Error(`failed to create or update season ${season}`, {
                    cause: 'updates/updateSeason.js',
                });
            }

            const newIntroOrder = await upsertIntroductionOrder(
                newSeason.season,
                data
            );

            const newPointsMax = await upsertPointsMax(newSeason.season, data);

            const newSnapshots = await upsertSnapshots(newSeason.season, data);

            const newDefendEvents = await upsertDefendEvents(
                newSeason.season,
                data
            );

            const newAttackEvents = await upsertAttackEvents(
                newSeason.season,
                data
            );

            if (!newSeason) {
                throw new Error(`Failed upsert: newSeason is falsy`, {
                    cause: 'updates/updateSeason.js',
                });
            }

            if (!newIntroOrder) {
                throw new Error(`Failed upsert: newIntroOrder is falsy`, {
                    cause: 'updates/updateSeason.js',
                });
            }

            if (!newPointsMax) {
                throw new Error(`Failed upsert: newPointsMax is falsy`, {
                    cause: 'updates/updateSeason.js',
                });
            }

            if (!newSnapshots) {
                throw new Error(`Failed upsert: newSnapshots is falsy`, {
                    cause: 'updates/updateSeason.js',
                });
            }

            if (!newDefendEvents) {
                throw new Error(`Failed upsert: newDefendEvents is falsy`, {
                    cause: 'updates/updateSeason.js',
                });
            }

            if (!newAttackEvents) {
                throw new Error(`Failed upsert: newAttackEvents is falsy`, {
                    cause: 'updates/updateSeason.js',
                });
            }

            const response = {
                time: newSeason.time,
                error_code: 0,
                introduction_order: newIntroOrder.json,
                points_max: newPointsMax.json,
                snapshots: newSnapshots,
                defend_events: newDefendEvents,
                attack_events: newAttackEvents,
            };

            if (verifySeason(data, response, season)) {
                const duration = performance.now() - start;

                log.info(
                    chalk.green(`(8/8) UPDATED SEASON `) +
                        chalk.magenta(season) +
                        chalk.white(' in ') +
                        chalk.blue(
                            (performance.now() - start).toFixed(3) + ' ms'
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
