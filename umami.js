import umami from '@umami/node';

let umamiClient = new umami.Umami({
    websiteId: '93ee0589-fb24-43f4-ad6c-929c8c0d7644', // Your website id
    hostUrl: 'https://umami.lavrenov.io', // URL to your Umami instance
    userAgent: 'helldivers1api', // User agent to send to Umami
});

console.log('✮ Umami client initialized');

//~ (optional) identify : update with you own session attributes
// const sessionId = Date.now();
// const identifyOptions = {
//     attribute: '11.23',
//     sessionId: sessionId,
// };
// console.log(`✮ identifyOptions ${identifyOptions}`);

// try {
//     console.log('✮ Identifying...');
//     umamiClient.identify(identifyOptions);
//     console.log('✮ Identified');
// } catch (error) {
//     console.error('✮ Identify failed', error);
// }

// await umamiClient.identify(identifyOptions);
console.log(umamiClient);
s;

//~ track a page
const url = `/home`;
const title = 'title of /home';
let event = { url, title };
// await umamiClient.track(event);
console.log(`✮ Page ${JSON.stringify(event)}`);

//~ track an event - an event has a *name*
const data = { color: 'red' };
event = { url, title, name: 'button-click', data };
// await umamiClient.track(event);
console.log(`✮ Event ${JSON.stringify(event)}`);

// async function runUmami(identifyOptions) {
//     console.log('✮ Running Umami...');
//     let response = await umamiClient.identify(identifyOptions);
//     console.log('✮ Umami identified');
// }

// runUmami(identifyOptions);
