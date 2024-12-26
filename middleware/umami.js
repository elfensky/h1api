import umami from '@umami/node';

const umamiClient = new umami.Umami({
    websiteId: '93ee0589-fb24-43f4-ad6c-929c8c0d7644', // Your website id
    hostUrl: 'https://umami.lavrenov.io', // URL to your Umami instance
    // userAgent: 'helldivers1api', // User agent to send to Umami
});

const sessionId = Date.now();
const identifyOptions = {
    attribute: '11.23',
    sessionId: sessionId,
};

// Middleware to log request performance
export default async function umamiMiddleware(req, res, next) {
    await umamiClient.identify(identifyOptions);

    const url = req.url;
    const title = `${req.method} ${req.url}`;
    let event = { url, title };
    const track = await umamiClient.track(event);
    console.log(track);
    // console.log(`✮ Page ${JSON.stringify(event)}`);

    // res.on('finish', () => {
    //     const end = performance.now();
    //     const duration = end - req.startTime;
    //     console.log(
    //         `Request to ${req.method} ${req.url} took ${duration.toFixed(3)} ms`
    //     );
    // });

    next();
}
