/*
  Warnings:

  - You are about to alter the column `accidentals` on the `Statistic` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `deaths` on the `Statistic` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `hits` on the `Statistic` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `kills` on the `Statistic` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `shots` on the `Statistic` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Statistic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" INTEGER NOT NULL,
    "season" INTEGER NOT NULL,
    "season_duration" INTEGER NOT NULL,
    "enemy" INTEGER NOT NULL,
    "players" INTEGER NOT NULL,
    "total_unique_players" INTEGER NOT NULL,
    "missions" INTEGER NOT NULL,
    "successful_missions" INTEGER NOT NULL,
    "total_mission_difficulty" INTEGER NOT NULL,
    "completed_planets" INTEGER NOT NULL,
    "defend_events" INTEGER NOT NULL,
    "successful_defend_events" INTEGER NOT NULL,
    "attack_events" INTEGER NOT NULL,
    "successful_attack_events" INTEGER NOT NULL,
    "deaths" BIGINT NOT NULL,
    "kills" BIGINT NOT NULL,
    "accidentals" BIGINT NOT NULL,
    "shots" BIGINT NOT NULL,
    "hits" BIGINT NOT NULL,
    CONSTRAINT "Statistic_timestamp_fkey" FOREIGN KEY ("timestamp") REFERENCES "Timestamp" ("timestamp") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Statistic" ("accidentals", "attack_events", "completed_planets", "deaths", "defend_events", "enemy", "hits", "id", "kills", "missions", "players", "season", "season_duration", "shots", "successful_attack_events", "successful_defend_events", "successful_missions", "timestamp", "total_mission_difficulty", "total_unique_players") SELECT "accidentals", "attack_events", "completed_planets", "deaths", "defend_events", "enemy", "hits", "id", "kills", "missions", "players", "season", "season_duration", "shots", "successful_attack_events", "successful_defend_events", "successful_missions", "timestamp", "total_mission_difficulty", "total_unique_players" FROM "Statistic";
DROP TABLE "Statistic";
ALTER TABLE "new_Statistic" RENAME TO "Statistic";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
