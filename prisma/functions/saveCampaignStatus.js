import prisma from '../prisma.js';

async function saveCampaignStatus(data) {
    try {
        // Ensure that the timestamp exists in the Timestamp table
        const existingTimestamp = await prisma.timestamp.findUnique({
            where: { timestamp: data.time },
        });

        if (!existingTimestamp) {
            throw new Error(
                `saveCampaignStatus() | Timestamp ${data.time} does not exist.`
            );
        }

        const newCampaignStatusArray = [];

        for (const status of data.campaign_status) {
            const newCampaignStatus = await prisma.campaignStatus.create({
                data: {
                    timestamp: data.time,
                    season: status.season,
                    points: status.points,
                    points_taken: status.points_taken,
                    points_max: status.points_max,
                    status: status.status,
                    introduction_order: status.introduction_order,
                },
            });
            newCampaignStatusArray.push(newCampaignStatus);
        }
        console.log(
            'saveCampaignStatus() | Campaign status saved successfully.'
        );
        return newCampaignStatusArray;
    } catch (error) {
        console.error(
            'saveCampaignStatus() | Failed to save campaign status:',
            error
        );
    }
}

export default saveCampaignStatus;
