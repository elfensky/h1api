import * as Sentry from '@sentry/node';

// Ensure to call this before importing any other modules!
Sentry.init({
    dsn: 'https://6de440716f66ddc77739c3889717e08f@o4506104681201664.ingest.us.sentry.io/4508529761714176',
    // Add Tracing by setting tracesSampleRate
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});
