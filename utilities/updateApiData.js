//fetch
import fetchCampaignStatus from './fetchCampaignStatus.js';
//db
import saveTimestamp from '../prisma/saveTimestamp.js';
import saveCampaignStatus from '../prisma/saveCampaignStatus.js';
import saveDefendEvent from '../prisma/saveDefendEvent.js';
import saveAttackEvent from '../prisma/saveAttackEvent.js';
import saveStatistics from '../prisma/saveStatistics.js';

export default async function updateApiData() {
    const data = await fetchCampaignStatus();

    if (data) {
        const timestamp = await saveTimestamp(data);

        if (timestamp.timestamp === data.time) {
            const campaignStatus = await saveCampaignStatus(data);
            const defendEvent = await saveDefendEvent(data);
            const attackEvents = await saveAttackEvent(data);
            const statistics = await saveStatistics(data);

            const respose = {
                time: timestamp.timestamp,
                error_code: 0,
                campaign_status: campaignStatus,
                defend_event: defendEvent,
                attack_events: attackEvents,
                statistics: statistics,
            };

            if (respose === data) {
                console.log('sucessfully saved api response to database');
            } else {
                console.error('failed to save api response to database');
            }
        }
    } else {
        console.error('Failed to get campaign status');
    }
}
