export default function getSeasonFromStatus(status) {
    const season = status.campaign_status[0].season;
    return season;
}
