import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

dotenv.config();

if (!process.env.SENTRY_DSN) {
    throw new Error('SENTRY_DSN is not set');
}

const release = 'helldivers1api@' + process.env.npm_package_version;
const environment = process.env.NODE_ENV || 'development';

// Ensure to call this before importing any other modules!
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    release: release,
    environment: environment,

    // Add Tracing by setting tracesSampleRate
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Set sampling rate for profiling
    // This is relative to tracesSampleRate
    profilesSampleRate: 1.0,
});

console.log('[Sentry] initializing sentry for ' + release);
// Sentry.profiler.startProfiler();
