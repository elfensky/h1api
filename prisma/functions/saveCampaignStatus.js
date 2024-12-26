import prisma from '../prisma.js';
// logs, monitoring, etc
import getLogger from '../../utilities/logger.js';
import chalk from 'chalk';
const log = getLogger();

async function saveCampaignStatus(data, foreignID = 0) {
    const start = performance.now();
    try {
        const datetime = new Date(data.time * 1000); // epoch to Date(Time) object

        // Ensure that the timestamp exists in the Timestamp table
        const existingTimestamp = await prisma.timestamp.findUnique({
            where: { timestamp: datetime },
        });

        if (!existingTimestamp) {
            throw new Error(
                chalk.red('timestamp ') +
                    chalk.magenta(data.time) +
                    chalk.red(' does not exist.')
            );
        }

        const newCampaignStatusArray = [];

        for (const status of data.campaign_status) {
            const newCampaignStatus = await prisma.campaignStatus.create({
                data: {
                    timestamp: datetime,
                    season: status.season,
                    points: status.points,
                    points_taken: status.points_taken,
                    points_max: status.points_max,
                    status: status.status,
                    introduction_order: status.introduction_order,
                },
            });

            const keysToRemove = ['id', 'timestamp'];
            keysToRemove.forEach((key) => {
                delete newCampaignStatus[key];
            });

            newCampaignStatusArray.push(newCampaignStatus);
        }

        log.info(
            chalk.white('UPDATE - saved (2/5) ') +
                chalk.magenta(data.time) +
                chalk.white("'s campaignStatus in ") +
                chalk.blue((performance.now() - start).toFixed(3) + ' ms')
        );

        return newCampaignStatusArray;
    } catch (error) {
        log.error(
            chalk.red('saveCampaignStatus() crashed: \n') + error.message
        );
        throw error;
    }
}

export default saveCampaignStatus;
