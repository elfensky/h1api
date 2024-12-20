//fetch
import fetchCampaignStatus from './fetchCampaignStatus.js';
//db
import saveTimestamp from '../prisma/functions/saveTimestamp.js';
import saveCampaignStatus from '../prisma/functions/saveCampaignStatus.js';
import saveDefendEvent from '../prisma/functions/saveDefendEvent.js';
import saveAttackEvent from '../prisma/functions/saveAttackEvent.js';
import saveStatistics from '../prisma/functions/saveStatistics.js';
import getCampaignData from '../prisma/functions/getCampaignData.js';
//utils
import { deepDiff } from '@bundled-es-modules/deep-diff';

export default async function updateApiData() {
    const data = await fetchCampaignStatus();

    if (data) {
        const timestamp = await saveTimestamp(data);

        if (timestamp.timestamp === data.time) {
            const campaignStatus = await saveCampaignStatus(data);
            const defendEvent = await saveDefendEvent(data);
            const attackEvents = await saveAttackEvent(data);
            const statistics = await saveStatistics(data);

            const response = {
                time: timestamp.timestamp,
                error_code: 0,
                campaign_status: campaignStatus,
                defend_event: defendEvent,
                attack_events: attackEvents,
                statistics: statistics,
            };

            const savedData = await getCampaignData();

            // compareObjects(savedData, response);
            if (response === data) {
                console.log(
                    'update: sucessfully saved api response to database'
                );
            } else {
                console.error(
                    'update: failed to save api response to database'
                );
            }
        }
    } else {
        console.error('update: Failed to get campaign status');
    }
}

function compareObjects(obj1, obj2) {
    const differences = deepDiff.diff(obj1, obj2);

    if (differences) {
        console.log('Differences found:');
        differences.forEach((difference) => {
            console.log(difference);
        });
    } else {
        console.log('No differences found.');
    }
}
