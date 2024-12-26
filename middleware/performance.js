import { performance } from 'perf_hooks';
// logs, monitoring, etc
import getLogger from '../utilities/logger.js';
import chalk from 'chalk';
const log = getLogger();

// Middleware to log request performance
export default function performanceMiddleware(req, res, next) {
    req.startTime = performance.now();

    res.on('finish', () => {
        const end = performance.now();
        const duration = end - req.startTime;
        log.info(
            chalk.white('PERF - request ') +
                chalk.yellow(req.method) +
                ' ' +
                chalk.yellow(req.url) +
                chalk.white(' took ') +
                chalk.blue(duration.toFixed(3) + ' ms')
        );
    });

    next();
}
