import getInfo from './info.js';
import { performance } from 'perf_hooks';
import { getLogger } from './loggers.js';
import chalk from 'chalk';
const log = getLogger();

export class HttpCodeError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export function logError(req, res, error) {
    let info;

    switch (error.constructor.name) {
        case 'ZodError':
            const messages = [`id: ${req.params.id}`];
            for (const issue of error.issues) {
                messages.push(issue.message.replace(/[\n\s]+/g, ' ').trim());
            }
            info = getInfo(req.startTime, 400);
            res.status(400).json({ info: info, error: messages });
            break;

        default:
            log.error(chalk.red('(1/2) in ') + chalk.magenta(error.cause));
            log.error(chalk.red('(2/2) ' + error.stack));
            info = getInfo(req.startTime, 500);
            res.status(400).json({ info: info, error: error.message });
            break;
    }
}
