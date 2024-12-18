-- CreateTable
CREATE TABLE "CampaignStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" INTEGER NOT NULL,
    "season" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "points_taken" INTEGER NOT NULL,
    "points_max" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "introduction_order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "DefendEvent" (
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
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AttackEvent" (
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
    "max_event_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Statistic" (
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
    "hits" INTEGER NOT NULL
);
