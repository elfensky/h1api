import { performance } from 'perf_hooks';
// logs, monitoring, etc
import getLogger from '../utilities/logger.js';
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
    });

    next();
}
