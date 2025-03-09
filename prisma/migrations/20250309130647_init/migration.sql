-- CreateTable
CREATE TABLE "appdata" (
    "id" TEXT NOT NULL,
    "active_season" INTEGER NOT NULL,
    "active_date" TIMESTAMP(3) NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appdata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "season" (
    "id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "season" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,

    CONSTRAINT "season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "introduction_order" (
    "id" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "json" JSONB NOT NULL,

    CONSTRAINT "introduction_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "points_max" (
    "id" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "json" JSONB NOT NULL,

    CONSTRAINT "points_max_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snapshots" (
    "id" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status" (
    "id" TEXT NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "season" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "campaign_status" JSONB NOT NULL,
    "defend_event" JSONB NOT NULL,
    "attack_events" JSONB NOT NULL,
    "statistics" JSONB NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statistics" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
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

    CONSTRAINT "statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defend_events" (
    "id" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "start_time" INTEGER NOT NULL,
    "end_time" INTEGER NOT NULL,
    "region" INTEGER NOT NULL,
    "enemy" INTEGER NOT NULL,
    "points_max" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "players_at_start" INTEGER,

    CONSTRAINT "defend_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attack_events" (
    "id" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "start_time" INTEGER NOT NULL,
    "end_time" INTEGER NOT NULL,
    "enemy" INTEGER NOT NULL,
    "points_max" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "players_at_start" INTEGER,

    CONSTRAINT "attack_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "appdata_id_key" ON "appdata"("id");

-- CreateIndex
CREATE UNIQUE INDEX "season_season_key" ON "season"("season");

-- CreateIndex
CREATE INDEX "season_season_idx" ON "season"("season");

-- CreateIndex
CREATE UNIQUE INDEX "introduction_order_season_key" ON "introduction_order"("season");

-- CreateIndex
CREATE INDEX "introduction_order_season_idx" ON "introduction_order"("season");

-- CreateIndex
CREATE UNIQUE INDEX "points_max_season_key" ON "points_max"("season");

-- CreateIndex
CREATE INDEX "points_max_season_idx" ON "points_max"("season");

-- CreateIndex
CREATE UNIQUE INDEX "snapshots_time_key" ON "snapshots"("time");

-- CreateIndex
CREATE UNIQUE INDEX "status_time_key" ON "status"("time");

-- CreateIndex
CREATE UNIQUE INDEX "statistics_hash_key" ON "statistics"("hash");

-- CreateIndex
CREATE INDEX "statistics_hash_idx" ON "statistics"("hash");

-- CreateIndex
CREATE INDEX "statistics_time_idx" ON "statistics"("time");

-- CreateIndex
CREATE INDEX "statistics_season_idx" ON "statistics"("season");

-- CreateIndex
CREATE UNIQUE INDEX "defend_events_event_id_key" ON "defend_events"("event_id");

-- CreateIndex
CREATE INDEX "defend_events_event_id_idx" ON "defend_events"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "attack_events_event_id_key" ON "attack_events"("event_id");

-- CreateIndex
CREATE INDEX "attack_events_event_id_idx" ON "attack_events"("event_id");

-- AddForeignKey
ALTER TABLE "introduction_order" ADD CONSTRAINT "introduction_order_season_fkey" FOREIGN KEY ("season") REFERENCES "season"("season") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points_max" ADD CONSTRAINT "points_max_season_fkey" FOREIGN KEY ("season") REFERENCES "season"("season") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "snapshots" ADD CONSTRAINT "snapshots_season_fkey" FOREIGN KEY ("season") REFERENCES "season"("season") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_time_fkey" FOREIGN KEY ("time") REFERENCES "status"("time") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_season_fkey" FOREIGN KEY ("season") REFERENCES "season"("season") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defend_events" ADD CONSTRAINT "defend_events_season_fkey" FOREIGN KEY ("season") REFERENCES "season"("season") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attack_events" ADD CONSTRAINT "attack_events_season_fkey" FOREIGN KEY ("season") REFERENCES "season"("season") ON DELETE RESTRICT ON UPDATE CASCADE;
