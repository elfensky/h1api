import pino from 'pino';
import pretty from 'pino-pretty';

let streamInstance;
export function getStream() {
    // Create a singleton instance of Pino
    const pinoPrettyOptions = {
        colorize: true,
        translateTime: true,
        ignore: 'pid,hostname',
        messageKey: 'message',
        ignoreObject: true,
        // Pretty print the timestamp
        formatter: ({ level, message, timestamp }) => {
            return `${timestamp} [${level}]: ${message}`;
        },
    };

    if (!streamInstance) {
        streamInstance = pretty(pinoPrettyOptions);
    }

    return streamInstance;
}

let loggerInstance;
export function getLogger() {
    // Create a singleton instance of Pino
    if (!loggerInstance) {
        loggerInstance = pino(getStream());
    }
    return loggerInstance;
}

export function logError(error) {
    const message = chalk.red(
        'in ' +
            chalk.magenta(error.cause) +
            ' of ' +
            chalk.magenta(error.name) +
            ' type. ' +
            chalk.red(error.message)
    );
    return message;
}
