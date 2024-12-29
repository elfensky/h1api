import { performance } from 'perf_hooks';
import axios from 'axios';
// logs, monitoring, etc
import { getLogger } from '../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

// Middleware to log request performance
export default function performanceMiddleware(req, res, next) {
    req.startTime = performance.now();

    res.on('finish', () => {
        const status = res.statusCode.toString()[0];

        const end = performance.now();
        const duration = end - req.startTime;

        const message =
            chalk.white('PERF - request ') +
            chalk.yellow(req.method) +
            ' ' +
            chalk.yellow(req.url) +
            chalk.white(' took ') +
            chalk.blue(duration.toFixed(3) + ' ms');

        if (status === '2') {
            //2xx
            log.info(message);
        }
        if (status === '4') {
            //4xx
            log.warn(message);
        }
        if (status === '5') {
            //5xx
            log.error(message);
        }
        // track(req, res);
    });

    next();
}

// async function track(req, res) {
//     const url = 'https://umami.lavrenov.io/api/send';
//     const payload = {
//         hostname: req.hostname,
//         method: req.method,
//         url: req.url,
//         title: `${req.method} ${req.url}`,
//         status: res.statusCode,
//         screen: '10x10',
//         // start: req.startTime,
//         // end: performance.now(),
//     };

//     try {
//         const response = await axios.post(url, { payload, type: 'event' });
//         log.info('track() successful: ' + response.data.beep);
//     } catch (error) {
//         log.error('track() failed: ' + error.message);
//     }
// }
