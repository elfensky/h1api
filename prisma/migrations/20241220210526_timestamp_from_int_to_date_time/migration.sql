/*
  Warnings:

  - The primary key for the `Timestamp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `timestamp` on the `AttackEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timestamp` on the `CampaignStatus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timestamp` on the `DefendEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `day` on the `Posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `last_updated` on the `Posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timestamp` on the `Statistic` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timestamp` on the `Timestamp` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE `AttackEvent` DROP FOREIGN KEY `AttackEvent_timestamp_fkey`;

-- DropForeignKey
ALTER TABLE `CampaignStatus` DROP FOREIGN KEY `CampaignStatus_timestamp_fkey`;

-- DropForeignKey
ALTER TABLE `DefendEvent` DROP FOREIGN KEY `DefendEvent_timestamp_fkey`;

-- DropForeignKey
ALTER TABLE `Statistic` DROP FOREIGN KEY `Statistic_timestamp_fkey`;

-- DropIndex
DROP INDEX `AttackEvent_timestamp_fkey` ON `AttackEvent`;

-- DropIndex
DROP INDEX `CampaignStatus_timestamp_fkey` ON `CampaignStatus`;

-- DropIndex
DROP INDEX `DefendEvent_timestamp_fkey` ON `DefendEvent`;

-- DropIndex
DROP INDEX `Statistic_timestamp_fkey` ON `Statistic`;

-- AlterTable
ALTER TABLE `AttackEvent` DROP COLUMN `timestamp`,
    ADD COLUMN `timestamp` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `CampaignStatus` DROP COLUMN `timestamp`,
    ADD COLUMN `timestamp` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `DefendEvent` DROP COLUMN `timestamp`,
    ADD COLUMN `timestamp` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Posts` DROP COLUMN `day`,
    ADD COLUMN `day` INTEGER NOT NULL,
    DROP COLUMN `last_updated`,
    ADD COLUMN `last_updated` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Statistic` DROP COLUMN `timestamp`,
    ADD COLUMN `timestamp` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Timestamp` DROP PRIMARY KEY,
    DROP COLUMN `timestamp`,
    ADD COLUMN `timestamp` INTEGER NOT NULL,
    ADD PRIMARY KEY (`timestamp`);

-- AddForeignKey
ALTER TABLE `CampaignStatus` ADD CONSTRAINT `CampaignStatus_timestamp_fkey` FOREIGN KEY (`timestamp`) REFERENCES `Timestamp`(`timestamp`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DefendEvent` ADD CONSTRAINT `DefendEvent_timestamp_fkey` FOREIGN KEY (`timestamp`) REFERENCES `Timestamp`(`timestamp`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttackEvent` ADD CONSTRAINT `AttackEvent_timestamp_fkey` FOREIGN KEY (`timestamp`) REFERENCES `Timestamp`(`timestamp`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Statistic` ADD CONSTRAINT `Statistic_timestamp_fkey` FOREIGN KEY (`timestamp`) REFERENCES `Timestamp`(`timestamp`) ON DELETE RESTRICT ON UPDATE CASCADE;
