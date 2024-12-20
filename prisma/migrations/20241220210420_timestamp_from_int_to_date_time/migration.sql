-- CreateTable
CREATE TABLE `Timestamp` (
    `timestamp` DATETIME(3) NOT NULL,

    PRIMARY KEY (`timestamp`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CampaignStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL,
    `season` INTEGER NOT NULL,
    `points` INTEGER NOT NULL,
    `points_taken` INTEGER NOT NULL,
    `points_max` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `introduction_order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DefendEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL,
    `season` INTEGER NOT NULL,
    `event_id` INTEGER NOT NULL,
    `start_time` INTEGER NOT NULL,
    `end_time` INTEGER NOT NULL,
    `region` INTEGER NOT NULL,
    `enemy` INTEGER NOT NULL,
    `points_max` INTEGER NOT NULL,
    `points` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttackEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL,
    `season` INTEGER NOT NULL,
    `event_id` INTEGER NOT NULL,
    `start_time` INTEGER NOT NULL,
    `end_time` INTEGER NOT NULL,
    `enemy` INTEGER NOT NULL,
    `points_max` INTEGER NOT NULL,
    `points` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `players_at_start` INTEGER NOT NULL,
    `max_event_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Statistic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL,
    `season` INTEGER NOT NULL,
    `season_duration` INTEGER NOT NULL,
    `enemy` INTEGER NOT NULL,
    `players` INTEGER NOT NULL,
    `total_unique_players` INTEGER NOT NULL,
    `missions` INTEGER NOT NULL,
    `successful_missions` INTEGER NOT NULL,
    `total_mission_difficulty` INTEGER NOT NULL,
    `completed_planets` INTEGER NOT NULL,
    `defend_events` INTEGER NOT NULL,
    `successful_defend_events` INTEGER NOT NULL,
    `attack_events` INTEGER NOT NULL,
    `successful_attack_events` INTEGER NOT NULL,
    `deaths` BIGINT NOT NULL,
    `kills` BIGINT NOT NULL,
    `accidentals` BIGINT NOT NULL,
    `shots` BIGINT NOT NULL,
    `hits` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `day` DATETIME(3) NOT NULL,
    `message_id` INTEGER NOT NULL,
    `last_updated` DATETIME(3) NOT NULL,
    `times_updated` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CampaignStatus` ADD CONSTRAINT `CampaignStatus_timestamp_fkey` FOREIGN KEY (`timestamp`) REFERENCES `Timestamp`(`timestamp`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DefendEvent` ADD CONSTRAINT `DefendEvent_timestamp_fkey` FOREIGN KEY (`timestamp`) REFERENCES `Timestamp`(`timestamp`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttackEvent` ADD CONSTRAINT `AttackEvent_timestamp_fkey` FOREIGN KEY (`timestamp`) REFERENCES `Timestamp`(`timestamp`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Statistic` ADD CONSTRAINT `Statistic_timestamp_fkey` FOREIGN KEY (`timestamp`) REFERENCES `Timestamp`(`timestamp`) ON DELETE RESTRICT ON UPDATE CASCADE;
