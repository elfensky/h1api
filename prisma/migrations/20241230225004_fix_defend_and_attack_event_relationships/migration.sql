/*
  Warnings:

  - A unique constraint covering the columns `[event_id]` on the table `attack_events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[event_id]` on the table `defend_events` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `attack_events_event_id_key` ON `attack_events`(`event_id`);

-- CreateIndex
CREATE UNIQUE INDEX `defend_events_event_id_key` ON `defend_events`(`event_id`);

-- AddForeignKey
ALTER TABLE `defend_events` ADD CONSTRAINT `defend_events_season_fkey` FOREIGN KEY (`season`) REFERENCES `season`(`season`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attack_events` ADD CONSTRAINT `attack_events_season_fkey` FOREIGN KEY (`season`) REFERENCES `season`(`season`) ON DELETE RESTRICT ON UPDATE CASCADE;
