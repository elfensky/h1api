/*
  Warnings:

  - You are about to drop the `app` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `app`;

-- CreateTable
CREATE TABLE `appdata` (
    `id` VARCHAR(191) NOT NULL,
    `active_season` INTEGER NOT NULL,
    `last_updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `appdata_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
