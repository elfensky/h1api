import { performance } from 'perf_hooks';

// Middleware to log request performance
export default function performanceMiddleware(req, res, next) {
    req.startTime = performance.now();

    res.on('finish', () => {
        const end = performance.now();
        const duration = end - req.startTime;
        console.log(
            `Request to ${req.method} ${req.url} took ${duration.toFixed(3)} ms`
        );
    });

    next();
}
