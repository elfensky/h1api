/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `app` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `app_id_key` ON `app`(`id`);
