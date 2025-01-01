/*
  Warnings:

  - Added the required column `season` to the `status` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `status` ADD COLUMN `season` INTEGER NOT NULL;
