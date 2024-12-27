import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

dotenv.config();
const release = 'helldivers1api@' + process.env.npm_package_version;

if (!process.env.SENTRY_DSN) {
    throw new Error('SENTRY_DSN is not set');
}

// Ensure to call this before importing any other modules!
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        // Add our Profiling integration
        nodeProfilingIntegration(),
    ],
    release: release,

    // Add Tracing by setting tracesSampleRate
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Set sampling rate for profiling
    // This is relative to tracesSampleRate
    profilesSampleRate: 1.0,
});

console.log('[Sentry] initializing sentry for ' + release);
// Sentry.profiler.startProfiler();
