import umami from '@umami/node';
// logs, monitoring, etc
import { getLogger } from '../utilities/loggers.js';
import chalk from 'chalk';
const log = getLogger();

// Middleware to log request performance
export default async function umamiMiddleware(req, res, next) {
    if (
        !req.url.includes('docs') &&
        !req.url.includes('pug') &&
        !req.url.includes('.')
    ) {
        // gather data
        const url = `/api${req.url}`;
        const title = `${req.method} ${req.url}`;
        const data = { color: 'red' };
        const userAgent = req.headers['user-agent'] || 'helldivers1api'; // Get the user agent
        const ip =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        //configure umami
        const event = {
            url,
            title,
        };

        const sessionId = ip.toString() || Date.now().toString();
        const identifyOptions = {
            // attribute: 'helldivers1api',
            attribute: '11.23',
            sessionId: sessionId,
        };

        let umamiClient = new umami.Umami({
            websiteId: '93ee0589-fb24-43f4-ad6c-929c8c0d7644', // Your website id
            hostUrl: 'https://umami.lavrenov.io', // URL to your Umami instance
            userAgent: userAgent, // User agent to send to Umami
        });

        try {
            await umamiClient.identify(identifyOptions).then((res) => {
                log.info('running umami - identify for ' + req.url);
            });
            await umamiClient.track(event).then((res) => {
                log.info('running umami - track for ' + req.url);
            });
        } catch (error) {
            log.error('umami failed: ' + error.message);
        }
    } else {
        if (req.url.includes('docs')) {
            log.info('skipping umami for docs - ' + req.url);
        }
        if (req.url.includes('pug')) {
            log.info('skipping umami for pug - ' + req.url);
        }
        if (req.url.includes('.')) {
            log.info('skipping umami for files - ' + req.url);
        }
    }

    next();
}
