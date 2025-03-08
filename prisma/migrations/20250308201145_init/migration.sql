-- CreateTable
CREATE TABLE `appdata` (
    `id` VARCHAR(191) NOT NULL,
    `active_season` INTEGER NOT NULL,
    `last_updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `appdata_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `season` (
    `id` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `last_updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `season` INTEGER NOT NULL,
    `time` INTEGER NOT NULL,

    UNIQUE INDEX `season_season_key`(`season`),
    INDEX `season_season_idx`(`season`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `introduction_order` (
    `id` VARCHAR(191) NOT NULL,
    `season` INTEGER NOT NULL,
    `json` JSON NOT NULL,

    UNIQUE INDEX `introduction_order_season_key`(`season`),
    INDEX `introduction_order_season_idx`(`season`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `points_max` (
    `id` VARCHAR(191) NOT NULL,
    `season` INTEGER NOT NULL,
    `json` JSON NOT NULL,

    UNIQUE INDEX `points_max_season_key`(`season`),
    INDEX `points_max_season_idx`(`season`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `snapshots` (
    `id` VARCHAR(191) NOT NULL,
    `season` INTEGER NOT NULL,
    `time` INTEGER NOT NULL,
    `data` JSON NOT NULL,

    UNIQUE INDEX `snapshots_time_key`(`time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status` (
    `id` VARCHAR(191) NOT NULL,
    `season` INTEGER NOT NULL,
    `time` INTEGER NOT NULL,
    `campaign_status` JSON NOT NULL,
    `defend_event` JSON NOT NULL,
    `attack_events` JSON NOT NULL,
    `statistics` JSON NOT NULL,

    UNIQUE INDEX `status_time_key`(`time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `statistics` (
    `id` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `time` INTEGER NOT NULL,
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

    UNIQUE INDEX `statistics_hash_key`(`hash`),
    INDEX `statistics_hash_idx`(`hash`),
    INDEX `statistics_time_idx`(`time`),
    INDEX `statistics_season_idx`(`season`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `defend_events` (
    `id` VARCHAR(191) NOT NULL,
    `season` INTEGER NOT NULL,
    `event_id` INTEGER NOT NULL,
    `start_time` INTEGER NOT NULL,
    `end_time` INTEGER NOT NULL,
    `region` INTEGER NOT NULL,
    `enemy` INTEGER NOT NULL,
    `points_max` INTEGER NOT NULL,
    `points` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `players_at_start` INTEGER NULL,

    UNIQUE INDEX `defend_events_event_id_key`(`event_id`),
    INDEX `defend_events_event_id_idx`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attack_events` (
    `id` VARCHAR(191) NOT NULL,
    `season` INTEGER NOT NULL,
    `event_id` INTEGER NOT NULL,
    `start_time` INTEGER NOT NULL,
    `end_time` INTEGER NOT NULL,
    `enemy` INTEGER NOT NULL,
    `points_max` INTEGER NOT NULL,
    `points` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `players_at_start` INTEGER NULL,

    UNIQUE INDEX `attack_events_event_id_key`(`event_id`),
    INDEX `attack_events_event_id_idx`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `introduction_order` ADD CONSTRAINT `introduction_order_season_fkey` FOREIGN KEY (`season`) REFERENCES `season`(`season`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `points_max` ADD CONSTRAINT `points_max_season_fkey` FOREIGN KEY (`season`) REFERENCES `season`(`season`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `snapshots` ADD CONSTRAINT `snapshots_season_fkey` FOREIGN KEY (`season`) REFERENCES `season`(`season`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `statistics` ADD CONSTRAINT `statistics_time_fkey` FOREIGN KEY (`time`) REFERENCES `status`(`time`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `statistics` ADD CONSTRAINT `statistics_season_fkey` FOREIGN KEY (`season`) REFERENCES `season`(`season`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `defend_events` ADD CONSTRAINT `defend_events_season_fkey` FOREIGN KEY (`season`) REFERENCES `season`(`season`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attack_events` ADD CONSTRAINT `attack_events_season_fkey` FOREIGN KEY (`season`) REFERENCES `season`(`season`) ON DELETE RESTRICT ON UPDATE CASCADE;
