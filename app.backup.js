//dependencies
// import dotenv from 'dotenv';
// middleware
// import umamiMiddleware from './middleware/umami.js';
// logs, monitoring, etc
// import pino from 'pino'; // Low overhead Node.js logger
// import pinoHttp from 'pino-http';
// import chalk from 'chalk'; // Colorful terminal output
// utils

app.use(
    pinoHttp({
        transport: {
            target: 'pino-pretty',
        },
    })
);
app.use(umamiMiddleware);

const log = getLogger();
log.fatal('fatal');
log.error('error');
log.warn('warn');
log.info('info');
log.debug('debug');
log.trace('trace');
