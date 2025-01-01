/*
  Warnings:

  - A unique constraint covering the columns `[time]` on the table `status` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attack_events` to the `status` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campaign_status` to the `status` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defend_event` to the `status` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statistics` to the `status` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `status` ADD COLUMN `attack_events` JSON NOT NULL,
    ADD COLUMN `campaign_status` JSON NOT NULL,
    ADD COLUMN `defend_event` JSON NOT NULL,
    ADD COLUMN `statistics` JSON NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `status_time_key` ON `status`(`time`);
