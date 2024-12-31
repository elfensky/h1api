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
import upsertSeason from '../prisma/func/upsertSeason.js';
import upsertIntroductionOrder from '../prisma/func/upsertIntroductionOrder.js';
import upsertPointsMax from '../prisma/func/upsertPointsMax.js';
import upsertSnapshots from '../prisma/func/upsertSnapshots.js';
import upsertDefendEvents from '../prisma/func/upsertDefendEvents.js';
import upsertAttackEvents from '../prisma/func/upsertAttackEvents.js';
//helpers
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
        time: 1735579560,
        error_code: 0,
        introduction_order: [1, 2, 0],
        points_max: [433910, 510040, 244080],
        snapshots: [
            {
                season: 142,
                time: 1731706548,
                data: '[{"points":216955,"points_taken":0,"status":"hidden"},{"points":255020,"points_taken":0,"status":"hidden"},{"points":122040,"points_taken":0,"status":"active"}]',
            },
            {
                season: 142,
                time: 1731715201,
                data: '[{"points":216955,"points_taken":0,"status":"hidden"},{"points":255020,"points_taken":0,"status":"hidden"},{"points":125320,"points_taken":3280,"status":"active"}]',
            },
            {
                season: 142,
                time: 1731801601,
                data: '[{"points":216955,"points_taken":0,"status":"hidden"},{"points":258506,"points_taken":3486,"status":"active"},{"points":170056,"points_taken":48016,"status":"active"}]',
            },
            {
                season: 142,
                time: 1731888001,
                data: '[{"points":219153,"points_taken":2198,"status":"active"},{"points":246908,"points_taken":42892,"status":"active"},{"points":183788,"points_taken":61748,"status":"active"}]',
            },
            {
                season: 142,
                time: 1731974401,
                data: '[{"points":252204,"points_taken":35249,"status":"active"},{"points":156012,"points_taken":54004,"status":"active"},{"points":187507,"points_taken":65467,"status":"active"}]',
            },
            {
                season: 142,
                time: 1732060801,
                data: '[{"points":276663,"points_taken":59708,"status":"active"},{"points":167433,"points_taken":65425,"status":"active"},{"points":194748,"points_taken":72708,"status":"active"}]',
            },
            {
                season: 142,
                time: 1732147201,
                data: '[{"points":299815,"points_taken":82860,"status":"active"},{"points":179958,"points_taken":77950,"status":"active"},{"points":200802,"points_taken":78762,"status":"active"}]',
            },
            {
                season: 142,
                time: 1732233601,
                data: '[{"points":322542,"points_taken":105587,"status":"active"},{"points":193118,"points_taken":91110,"status":"active"},{"points":206754,"points_taken":84714,"status":"active"}]',
            },
            {
                season: 142,
                time: 1732320001,
                data: '[{"points":345886,"points_taken":128931,"status":"active"},{"points":208027,"points_taken":106019,"status":"active"},{"points":190225,"points_taken":92593,"status":"active"}]',
            },
            {
                season: 142,
                time: 1732406401,
                data: '[{"points":375092,"points_taken":158137,"status":"active"},{"points":228589,"points_taken":126581,"status":"active"},{"points":151160,"points_taken":102344,"status":"active"}]',
            },
            {
                season: 142,
                time: 1732492801,
                data: '[{"points":406063,"points_taken":189108,"status":"active"},{"points":249931,"points_taken":147923,"status":"active"},{"points":158832,"points_taken":110016,"status":"active"}]',
            },
            {
                season: 142,
                time: 1732579201,
                data: '[{"points":428274,"points_taken":211319,"status":"active"},{"points":264228,"points_taken":162220,"status":"active"},{"points":165934,"points_taken":117118,"status":"active"}]',
            },
            {
                season: 142,
                time: 1732665601,
                data: '[{"points":433910,"points_taken":218362,"status":"active"},{"points":275990,"points_taken":173982,"status":"active"},{"points":171847,"points_taken":123031,"status":"active"}]',
            },
            {
                season: 142,
                time: 1732752001,
                data: '[{"points":433910,"points_taken":219141,"status":"active"},{"points":288224,"points_taken":186216,"status":"active"},{"points":177203,"points_taken":128387,"status":"active"}]',
            },
            {
                season: 142,
                time: 1732838401,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":319646,"points_taken":217638,"status":"active"},{"points":189250,"points_taken":140434,"status":"active"}]',
            },
            {
                season: 142,
                time: 1732924801,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":359777,"points_taken":257769,"status":"active"},{"points":206513,"points_taken":157697,"status":"active"}]',
            },
            {
                season: 142,
                time: 1733011201,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":411348,"points_taken":309340,"status":"active"},{"points":229602,"points_taken":180786,"status":"active"}]',
            },
            {
                season: 142,
                time: 1733097601,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":147827,"points_taken":351843,"status":"active"},{"points":244080,"points_taken":196135,"status":"active"}]',
            },
            {
                season: 142,
                time: 1733184001,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":186345,"points_taken":390361,"status":"active"},{"points":244080,"points_taken":196688,"status":"active"}]',
            },
            {
                season: 142,
                time: 1733270401,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":222640,"points_taken":426656,"status":"active"},{"points":168807,"points_taken":200353,"status":"active"}]',
            },
            {
                season: 142,
                time: 1733356801,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":257647,"points_taken":461663,"status":"active"},{"points":162671,"points_taken":219980,"status":"active"}]',
            },
            {
                season: 142,
                time: 1733443201,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":290995,"points_taken":495011,"status":"active"},{"points":180158,"points_taken":237447,"status":"active"}]',
            },
            {
                season: 142,
                time: 1733529601,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":280825,"points_taken":535845,"status":"active"},{"points":196513,"points_taken":253802,"status":"active"}]',
            },
            {
                season: 142,
                time: 1733616001,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":331525,"points_taken":586545,"status":"active"},{"points":221095,"points_taken":278384,"status":"active"}]',
            },
            {
                season: 142,
                time: 1733702401,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":325976,"points_taken":632000,"status":"active"},{"points":242260,"points_taken":299549,"status":"active"}]',
            },
            {
                season: 142,
                time: 1733788801,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":354501,"points_taken":660525,"status":"active"},{"points":244080,"points_taken":302537,"status":"active"}]',
            },
            {
                season: 142,
                time: 1733875202,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":380626,"points_taken":686650,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
            {
                season: 142,
                time: 1733961601,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":374819,"points_taken":731847,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
            {
                season: 142,
                time: 1734048001,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":415523,"points_taken":772551,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
            {
                season: 142,
                time: 1734134401,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":404027,"points_taken":817445,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
            {
                season: 142,
                time: 1734220801,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":970,"points_taken":852250,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
            {
                season: 142,
                time: 1734307201,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":1666,"points_taken":852946,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
            {
                season: 142,
                time: 1734393601,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":48142,"points_taken":899422,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
            {
                season: 142,
                time: 1734480001,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":95345,"points_taken":946625,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
            {
                season: 142,
                time: 1734566401,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":144941,"points_taken":996221,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
            {
                season: 142,
                time: 1734652801,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":1299,"points_taken":1012649,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
            {
                season: 142,
                time: 1734739202,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":1841,"points_taken":1013191,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
            {
                season: 142,
                time: 1734825601,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":84958,"points_taken":1096308,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
            {
                season: 142,
                time: 1734912001,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":50341,"points_taken":1178898,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
            {
                season: 142,
                time: 1734998401,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":1929,"points_taken":1181222,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
            {
                season: 142,
                time: 1735084801,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":2757,"points_taken":1182050,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
            {
                season: 142,
                time: 1735086001,
                data: '[{"points":433910,"points_taken":219181,"status":"defeated"},{"points":0,"points_taken":1182050,"status":"active"},{"points":244080,"points_taken":302745,"status":"defeated"}]',
            },
        ],
        defend_events: [
            {
                season: 142,
                event_id: 4187,
                start_time: 1731876241,
                end_time: 1731885241,
                region: 6,
                enemy: 1,
                points_max: 2123,
                points: 623,
                status: 'fail',
                players_at_start: 259,
            },
            {
                season: 142,
                event_id: 4188,
                start_time: 1731885301,
                end_time: 1731894301,
                region: 5,
                enemy: 1,
                points_max: 1275,
                points: 266,
                status: 'fail',
                players_at_start: 241,
            },
            {
                season: 142,
                event_id: 4189,
                start_time: 1731894361,
                end_time: 1731903361,
                region: 4,
                enemy: 1,
                points_max: 610,
                points: 254,
                status: 'fail',
                players_at_start: 191,
            },
            {
                season: 142,
                event_id: 4190,
                start_time: 1731903421,
                end_time: 1731911821,
                region: 3,
                enemy: 1,
                points_max: 424,
                points: 424,
                status: 'success',
                players_at_start: 188,
            },
            {
                season: 142,
                event_id: 4191,
                start_time: 1732011781,
                end_time: 1732020121,
                region: 7,
                enemy: 0,
                points_max: 322,
                points: 322,
                status: 'success',
                players_at_start: 113,
            },
            {
                season: 142,
                event_id: 4192,
                start_time: 1732137062,
                end_time: 1732144501,
                region: 7,
                enemy: 0,
                points_max: 676,
                points: 676,
                status: 'success',
                players_at_start: 221,
            },
            {
                season: 142,
                event_id: 4193,
                start_time: 1732307281,
                end_time: 1732316281,
                region: 9,
                enemy: 2,
                points_max: 1216,
                points: 720,
                status: 'fail',
                players_at_start: 248,
            },
            {
                season: 142,
                event_id: 4194,
                start_time: 1732316341,
                end_time: 1732325341,
                region: 8,
                enemy: 2,
                points_max: 879,
                points: 674,
                status: 'fail',
                players_at_start: 226,
            },
            {
                season: 142,
                event_id: 4195,
                start_time: 1732325401,
                end_time: 1732334401,
                region: 7,
                enemy: 2,
                points_max: 746,
                points: 521,
                status: 'fail',
                players_at_start: 218,
            },
            {
                season: 142,
                event_id: 4196,
                start_time: 1732334462,
                end_time: 1732342681,
                region: 6,
                enemy: 2,
                points_max: 739,
                points: 739,
                status: 'success',
                players_at_start: 255,
            },
            {
                season: 142,
                event_id: 4197,
                start_time: 1732434782,
                end_time: 1732441501,
                region: 5,
                enemy: 1,
                points_max: 615,
                points: 615,
                status: 'success',
                players_at_start: 256,
            },
            {
                season: 142,
                event_id: 4198,
                start_time: 1732556102,
                end_time: 1732562521,
                region: 10,
                enemy: 0,
                points_max: 730,
                points: 730,
                status: 'success',
                players_at_start: 199,
            },
            {
                season: 142,
                event_id: 4199,
                start_time: 1732755182,
                end_time: 1732763401,
                region: 6,
                enemy: 1,
                points_max: 805,
                points: 805,
                status: 'success',
                players_at_start: 252,
            },
            {
                season: 142,
                event_id: 4200,
                start_time: 1732872421,
                end_time: 1732879022,
                region: 7,
                enemy: 1,
                points_max: 685,
                points: 685,
                status: 'success',
                players_at_start: 197,
            },
            {
                season: 142,
                event_id: 4201,
                start_time: 1733004601,
                end_time: 1733013601,
                region: 9,
                enemy: 1,
                points_max: 1993,
                points: 1598,
                status: 'fail',
                players_at_start: 423,
            },
            {
                season: 142,
                event_id: 4202,
                start_time: 1733013661,
                end_time: 1733022661,
                region: 8,
                enemy: 1,
                points_max: 1925,
                points: 1451,
                status: 'fail',
                players_at_start: 412,
            },
            {
                season: 142,
                event_id: 4203,
                start_time: 1733022721,
                end_time: 1733031721,
                region: 7,
                enemy: 1,
                points_max: 1992,
                points: 1505,
                status: 'fail',
                players_at_start: 431,
            },
            {
                season: 142,
                event_id: 4204,
                start_time: 1733031722,
                end_time: 1733040722,
                region: 6,
                enemy: 1,
                points_max: 2000,
                points: 1198,
                status: 'fail',
                players_at_start: 438,
            },
            {
                season: 142,
                event_id: 4205,
                start_time: 1733040782,
                end_time: 1733049782,
                region: 5,
                enemy: 1,
                points_max: 1847,
                points: 1002,
                status: 'fail',
                players_at_start: 413,
            },
            {
                season: 142,
                event_id: 4206,
                start_time: 1733049842,
                end_time: 1733058842,
                region: 4,
                enemy: 1,
                points_max: 1769,
                points: 1439,
                status: 'fail',
                players_at_start: 406,
            },
            {
                season: 142,
                event_id: 4207,
                start_time: 1733058901,
                end_time: 1733067061,
                region: 3,
                enemy: 1,
                points_max: 1990,
                points: 1990,
                status: 'success',
                players_at_start: 462,
            },
            {
                season: 142,
                event_id: 4208,
                start_time: 1733248262,
                end_time: 1733257262,
                region: 9,
                enemy: 2,
                points_max: 1098,
                points: 865,
                status: 'fail',
                players_at_start: 348,
            },
            {
                season: 142,
                event_id: 4209,
                start_time: 1733257321,
                end_time: 1733266321,
                region: 8,
                enemy: 2,
                points_max: 948,
                points: 798,
                status: 'fail',
                players_at_start: 310,
            },
            {
                season: 142,
                event_id: 4210,
                start_time: 1733266322,
                end_time: 1733275322,
                region: 7,
                enemy: 2,
                points_max: 869,
                points: 677,
                status: 'fail',
                players_at_start: 291,
            },
            {
                season: 142,
                event_id: 4211,
                start_time: 1733275382,
                end_time: 1733282761,
                region: 6,
                enemy: 2,
                points_max: 658,
                points: 658,
                status: 'success',
                players_at_start: 228,
            },
            {
                season: 142,
                event_id: 4212,
                start_time: 1733395922,
                end_time: 1733402642,
                region: 7,
                enemy: 2,
                points_max: 736,
                points: 736,
                status: 'success',
                players_at_start: 211,
            },
            {
                season: 142,
                event_id: 4213,
                start_time: 1733509682,
                end_time: 1733518682,
                region: 7,
                enemy: 1,
                points_max: 1719,
                points: 990,
                status: 'fail',
                players_at_start: 364,
            },
            {
                season: 142,
                event_id: 4214,
                start_time: 1733518742,
                end_time: 1733527321,
                region: 6,
                enemy: 1,
                points_max: 1324,
                points: 1324,
                status: 'success',
                players_at_start: 314,
            },
            {
                season: 142,
                event_id: 4215,
                start_time: 1733646001,
                end_time: 1733655001,
                region: 7,
                enemy: 1,
                points_max: 1463,
                points: 1396,
                status: 'fail',
                players_at_start: 332,
            },
            {
                season: 142,
                event_id: 4216,
                start_time: 1733655061,
                end_time: 1733663401,
                region: 6,
                enemy: 1,
                points_max: 1457,
                points: 1457,
                status: 'success',
                players_at_start: 336,
            },
            {
                season: 142,
                event_id: 4217,
                start_time: 1733870041,
                end_time: 1733879041,
                region: 8,
                enemy: 1,
                points_max: 991,
                points: 679,
                status: 'fail',
                players_at_start: 213,
            },
            {
                season: 142,
                event_id: 4218,
                start_time: 1733879102,
                end_time: 1733885821,
                region: 7,
                enemy: 1,
                points_max: 686,
                points: 686,
                status: 'success',
                players_at_start: 169,
            },
            {
                season: 142,
                event_id: 4219,
                start_time: 1734009001,
                end_time: 1734017581,
                region: 8,
                enemy: 1,
                points_max: 1226,
                points: 1226,
                status: 'success',
                players_at_start: 227,
            },
            {
                season: 142,
                event_id: 4220,
                start_time: 1734121862,
                end_time: 1734130862,
                region: 9,
                enemy: 1,
                points_max: 1530,
                points: 881,
                status: 'fail',
                players_at_start: 271,
            },
            {
                season: 142,
                event_id: 4221,
                start_time: 1734130921,
                end_time: 1734139921,
                region: 8,
                enemy: 1,
                points_max: 1242,
                points: 877,
                status: 'fail',
                players_at_start: 220,
            },
            {
                season: 142,
                event_id: 4222,
                start_time: 1734139982,
                end_time: 1734148982,
                region: 7,
                enemy: 1,
                points_max: 1123,
                points: 784,
                status: 'fail',
                players_at_start: 199,
            },
            {
                season: 142,
                event_id: 4223,
                start_time: 1734149041,
                end_time: 1734158041,
                region: 6,
                enemy: 1,
                points_max: 1394,
                points: 865,
                status: 'fail',
                players_at_start: 247,
            },
            {
                season: 142,
                event_id: 4224,
                start_time: 1734158042,
                end_time: 1734167042,
                region: 5,
                enemy: 1,
                points_max: 1276,
                points: 878,
                status: 'fail',
                players_at_start: 226,
            },
            {
                season: 142,
                event_id: 4225,
                start_time: 1734167101,
                end_time: 1734176101,
                region: 4,
                enemy: 1,
                points_max: 1519,
                points: 1228,
                status: 'fail',
                players_at_start: 269,
            },
            {
                season: 142,
                event_id: 4226,
                start_time: 1734176102,
                end_time: 1734185102,
                region: 3,
                enemy: 1,
                points_max: 1490,
                points: 1134,
                status: 'fail',
                players_at_start: 264,
            },
            {
                season: 142,
                event_id: 4227,
                start_time: 1734185162,
                end_time: 1734194162,
                region: 2,
                enemy: 1,
                points_max: 2236,
                points: 1651,
                status: 'fail',
                players_at_start: 396,
            },
            {
                season: 142,
                event_id: 4228,
                start_time: 1734194221,
                end_time: 1734203221,
                region: 1,
                enemy: 1,
                points_max: 2462,
                points: 1161,
                status: 'fail',
                players_at_start: 436,
            },
            {
                season: 142,
                event_id: 4229,
                start_time: 1734203222,
                end_time: 1734328381,
                region: 0,
                enemy: 1,
                points_max: 35903,
                points: 35903,
                status: 'success',
                players_at_start: 289,
            },
            {
                season: 142,
                event_id: 4230,
                start_time: 1734434162,
                end_time: 1734442682,
                region: 2,
                enemy: 1,
                points_max: 1196,
                points: 1196,
                status: 'success',
                players_at_start: 162,
            },
            {
                season: 142,
                event_id: 4231,
                start_time: 1734576842,
                end_time: 1734585842,
                region: 3,
                enemy: 1,
                points_max: 1748,
                points: 1188,
                status: 'fail',
                players_at_start: 225,
            },
            {
                season: 142,
                event_id: 4232,
                start_time: 1734585902,
                end_time: 1734594902,
                region: 2,
                enemy: 1,
                points_max: 1740,
                points: 678,
                status: 'fail',
                players_at_start: 224,
            },
            {
                season: 142,
                event_id: 4233,
                start_time: 1734594961,
                end_time: 1734603961,
                region: 1,
                enemy: 1,
                points_max: 1227,
                points: 764,
                status: 'fail',
                players_at_start: 158,
            },
            {
                season: 142,
                event_id: 4234,
                start_time: 1734603962,
                end_time: 1734739082,
                region: 0,
                enemy: 1,
                points_max: 39658,
                points: 39658,
                status: 'success',
                players_at_start: 232,
            },
            {
                season: 142,
                event_id: 4235,
                start_time: 1734886021,
                end_time: 1734895021,
                region: 3,
                enemy: 1,
                points_max: 5387,
                points: 2172,
                status: 'fail',
                players_at_start: 566,
            },
            {
                season: 142,
                event_id: 4236,
                start_time: 1734895022,
                end_time: 1734904022,
                region: 2,
                enemy: 1,
                points_max: 5035,
                points: 1727,
                status: 'fail',
                players_at_start: 529,
            },
            {
                season: 142,
                event_id: 4237,
                start_time: 1734904082,
                end_time: 1734913082,
                region: 1,
                enemy: 1,
                points_max: 4930,
                points: 1633,
                status: 'fail',
                players_at_start: 518,
            },
            {
                season: 142,
                event_id: 4238,
                start_time: 1734913142,
                end_time: 1735085942,
                region: 0,
                enemy: 1,
                points_max: 104289,
                points: 65060,
                status: 'fail',
                players_at_start: 498,
            },
        ],
        attack_events: [
            {
                season: 142,
                event_id: 844,
                start_time: 1732608961,
                end_time: 1732755121,
                enemy: 0,
                points_max: 21163,
                points: 21163,
                status: 'success',
                players_at_start: 189,
            },
            {
                season: 142,
                event_id: 845,
                start_time: 1733075402,
                end_time: 1733248202,
                enemy: 2,
                points_max: 33433,
                points: 23638,
                status: 'fail',
                players_at_start: 455,
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
            },
        ],
    };
}

export default async function updateSeason(season) {
    const start = performance.now();

    try {
        const data = await fetchSeasonTEST(season);

        if (!data) {
            throw new Error('No data available', {
                cause: 'updates/updateSeason.js',
            });
        } else {
            const updatedSeason = await upsertSeason(season, data);

            if (!updatedSeason) {
                throw new Error(`failed to create or update season ${season}`, {
                    cause: 'updates/updateSeason.js',
                });
            }

            const newIntroOrder = await upsertIntroductionOrder(
                updatedSeason.season,
                data
            );

            const newPointsMax = await upsertPointsMax(
                updatedSeason.season,
                data
            );

            const newSnapshots = await upsertSnapshots(
                updatedSeason.season,
                data
            );

            const newDefendEvents = await upsertDefendEvents(
                updatedSeason.season,
                data
            );

            const newAttackEvents = await upsertAttackEvents(
                updatedSeason.season,
                data
            );

            const response = {
                time: updatedSeason.time,
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
                log.warn(chalk.yellow('Mismatch between API and DB'));
            }

            // return newSeason;
            return { 'this will be a new season': 'data' };
        }
    } catch (error) {
        log.error(chalk.red('(1/2) in ') + chalk.magenta(error.cause));
        log.error(chalk.red('(2/2) ' + error.stack));
    }
}
