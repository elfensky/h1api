/*
  Warnings:

  - You are about to drop the `TimeStamps` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TimeStamps";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Timestamp" (
    "timestamp" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AttackEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" INTEGER NOT NULL,
    "season" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "start_time" INTEGER NOT NULL,
    "end_time" INTEGER NOT NULL,
    "enemy" INTEGER NOT NULL,
    "points_max" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "players_at_start" INTEGER NOT NULL,
    "max_event_id" INTEGER NOT NULL,
    CONSTRAINT "AttackEvent_timestamp_fkey" FOREIGN KEY ("timestamp") REFERENCES "Timestamp" ("timestamp") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AttackEvent" ("end_time", "enemy", "event_id", "id", "max_event_id", "players_at_start", "points", "points_max", "season", "start_time", "status", "timestamp") SELECT "end_time", "enemy", "event_id", "id", "max_event_id", "players_at_start", "points", "points_max", "season", "start_time", "status", "timestamp" FROM "AttackEvent";
DROP TABLE "AttackEvent";
ALTER TABLE "new_AttackEvent" RENAME TO "AttackEvent";
CREATE TABLE "new_CampaignStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" INTEGER NOT NULL,
    "season" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "points_taken" INTEGER NOT NULL,
    "points_max" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "introduction_order" INTEGER NOT NULL,
    CONSTRAINT "CampaignStatus_timestamp_fkey" FOREIGN KEY ("timestamp") REFERENCES "Timestamp" ("timestamp") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CampaignStatus" ("id", "introduction_order", "points", "points_max", "points_taken", "season", "status", "timestamp") SELECT "id", "introduction_order", "points", "points_max", "points_taken", "season", "status", "timestamp" FROM "CampaignStatus";
DROP TABLE "CampaignStatus";
ALTER TABLE "new_CampaignStatus" RENAME TO "CampaignStatus";
CREATE TABLE "new_DefendEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" INTEGER NOT NULL,
    "season" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "start_time" INTEGER NOT NULL,
    "end_time" INTEGER NOT NULL,
    "region" INTEGER NOT NULL,
    "enemy" INTEGER NOT NULL,
    "points_max" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "DefendEvent_timestamp_fkey" FOREIGN KEY ("timestamp") REFERENCES "Timestamp" ("timestamp") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DefendEvent" ("end_time", "enemy", "event_id", "id", "points", "points_max", "region", "season", "start_time", "status", "timestamp") SELECT "end_time", "enemy", "event_id", "id", "points", "points_max", "region", "season", "start_time", "status", "timestamp" FROM "DefendEvent";
DROP TABLE "DefendEvent";
ALTER TABLE "new_DefendEvent" RENAME TO "DefendEvent";
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
    "deaths" INTEGER NOT NULL,
    "kills" INTEGER NOT NULL,
    "accidentals" INTEGER NOT NULL,
    "shots" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,
    CONSTRAINT "Statistic_timestamp_fkey" FOREIGN KEY ("timestamp") REFERENCES "Timestamp" ("timestamp") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Statistic" ("accidentals", "attack_events", "completed_planets", "deaths", "defend_events", "enemy", "hits", "id", "kills", "missions", "players", "season", "season_duration", "shots", "successful_attack_events", "successful_defend_events", "successful_missions", "timestamp", "total_mission_difficulty", "total_unique_players") SELECT "accidentals", "attack_events", "completed_planets", "deaths", "defend_events", "enemy", "hits", "id", "kills", "missions", "players", "season", "season_duration", "shots", "successful_attack_events", "successful_defend_events", "successful_missions", "timestamp", "total_mission_difficulty", "total_unique_players" FROM "Statistic";
DROP TABLE "Statistic";
ALTER TABLE "new_Statistic" RENAME TO "Statistic";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
