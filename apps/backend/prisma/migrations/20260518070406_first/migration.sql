-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT,
    "height" REAL,
    "currentWeight" REAL,
    "targetWeight" REAL,
    "activityLevel" TEXT NOT NULL DEFAULT 'MODERATE',
    "goalType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "workout_types" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "trackingType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "workout_types_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workouts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "workoutTypeId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT,
    "tips" TEXT,
    "notes" TEXT,
    "videoUrl" TEXT,
    "imageUrl" TEXT,
    "muscleGroup" TEXT NOT NULL,
    "equipmentType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "workouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workouts_workoutTypeId_fkey" FOREIGN KEY ("workoutTypeId") REFERENCES "workout_types" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workout_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "splitType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "workout_templates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workout_template_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    "workoutId" TEXT,
    "position" INTEGER NOT NULL,
    "targetSets" INTEGER,
    "targetReps" INTEGER,
    "targetWeight" REAL,
    "targetDurationSeconds" INTEGER,
    "targetDistanceKm" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "workout_template_items_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "workout_templates" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workout_template_items_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scheduled_workouts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "workoutId" TEXT NOT NULL,
    "scheduledDate" DATETIME NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 1,
    "targetSets" INTEGER,
    "targetReps" INTEGER,
    "targetWeight" REAL,
    "targetDurationSeconds" INTEGER,
    "targetDistanceKm" REAL,
    "recurrenceRule" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "completedAt" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "scheduled_workouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "scheduled_workouts_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workout_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "workoutId" TEXT NOT NULL,
    "scheduledWorkoutId" TEXT,
    "sessionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationSeconds" INTEGER,
    "steps" INTEGER,
    "distanceKm" REAL,
    "caloriesBurned" INTEGER,
    "perceivedDifficulty" TEXT,
    "energyLevel" INTEGER,
    "notes" TEXT,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "workout_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workout_sessions_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workout_sessions_scheduledWorkoutId_fkey" FOREIGN KEY ("scheduledWorkoutId") REFERENCES "scheduled_workouts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workout_session_sets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "reps" INTEGER,
    "weight" REAL,
    "restTimeSeconds" INTEGER,
    "durationSeconds" INTEGER,
    "distanceKm" REAL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "workout_session_sets_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "workout_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "mealType" TEXT NOT NULL,
    "protein" REAL NOT NULL DEFAULT 0,
    "carbs" REAL NOT NULL DEFAULT 0,
    "fats" REAL NOT NULL DEFAULT 0,
    "calories" INTEGER NOT NULL DEFAULT 0,
    "fiber" REAL,
    "sugar" REAL,
    "sodium" REAL,
    "mealDate" DATETIME NOT NULL,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "meals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meal_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "mealId" TEXT,
    "mealDate" DATETIME NOT NULL,
    "quantity" REAL NOT NULL DEFAULT 1,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "meal_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "meal_entries_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "nutrition_goals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "dailyCalories" INTEGER NOT NULL,
    "protein" REAL NOT NULL,
    "carbs" REAL NOT NULL,
    "fats" REAL NOT NULL,
    "waterMl" INTEGER NOT NULL,
    "effectiveFrom" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "nutrition_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "body_progress_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "entryDate" DATETIME NOT NULL,
    "bodyWeight" REAL,
    "waist" REAL,
    "chest" REAL,
    "arms" REAL,
    "thighs" REAL,
    "hips" REAL,
    "bodyFatPercentage" REAL,
    "photoUrl" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "body_progress_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "habit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "logDate" DATETIME NOT NULL,
    "waterMl" INTEGER,
    "sleepHours" REAL,
    "steps" INTEGER,
    "mood" TEXT,
    "soreness" INTEGER,
    "energyLevel" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "habit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "analytics_snapshots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "analytics_snapshots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "unitSystem" TEXT NOT NULL DEFAULT 'IMPERIAL',
    "distanceUnit" TEXT NOT NULL DEFAULT 'MI',
    "notificationPreferences" TEXT NOT NULL DEFAULT '{"workouts":true,"meals":true,"water":true,"weighIns":true}',
    "weekStartDay" TEXT NOT NULL DEFAULT 'MONDAY',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

-- CreateIndex
CREATE INDEX "workout_types_trackingType_idx" ON "workout_types"("trackingType");

-- CreateIndex
CREATE INDEX "workout_types_deletedAt_idx" ON "workout_types"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "workout_types_userId_name_key" ON "workout_types"("userId", "name");

-- CreateIndex
CREATE INDEX "workouts_userId_name_idx" ON "workouts"("userId", "name");

-- CreateIndex
CREATE INDEX "workouts_workoutTypeId_idx" ON "workouts"("workoutTypeId");

-- CreateIndex
CREATE INDEX "workouts_muscleGroup_idx" ON "workouts"("muscleGroup");

-- CreateIndex
CREATE INDEX "workouts_equipmentType_idx" ON "workouts"("equipmentType");

-- CreateIndex
CREATE INDEX "workouts_deletedAt_idx" ON "workouts"("deletedAt");

-- CreateIndex
CREATE INDEX "workout_templates_userId_name_idx" ON "workout_templates"("userId", "name");

-- CreateIndex
CREATE INDEX "workout_templates_deletedAt_idx" ON "workout_templates"("deletedAt");

-- CreateIndex
CREATE INDEX "workout_template_items_workoutId_idx" ON "workout_template_items"("workoutId");

-- CreateIndex
CREATE UNIQUE INDEX "workout_template_items_templateId_position_key" ON "workout_template_items"("templateId", "position");

-- CreateIndex
CREATE INDEX "scheduled_workouts_userId_scheduledDate_idx" ON "scheduled_workouts"("userId", "scheduledDate");

-- CreateIndex
CREATE INDEX "scheduled_workouts_workoutId_idx" ON "scheduled_workouts"("workoutId");

-- CreateIndex
CREATE INDEX "scheduled_workouts_status_idx" ON "scheduled_workouts"("status");

-- CreateIndex
CREATE INDEX "scheduled_workouts_deletedAt_idx" ON "scheduled_workouts"("deletedAt");

-- CreateIndex
CREATE INDEX "workout_sessions_userId_sessionDate_idx" ON "workout_sessions"("userId", "sessionDate");

-- CreateIndex
CREATE INDEX "workout_sessions_workoutId_idx" ON "workout_sessions"("workoutId");

-- CreateIndex
CREATE INDEX "workout_sessions_scheduledWorkoutId_idx" ON "workout_sessions"("scheduledWorkoutId");

-- CreateIndex
CREATE INDEX "workout_sessions_deletedAt_idx" ON "workout_sessions"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "workout_session_sets_sessionId_setNumber_key" ON "workout_session_sets"("sessionId", "setNumber");

-- CreateIndex
CREATE INDEX "meals_userId_mealDate_idx" ON "meals"("userId", "mealDate");

-- CreateIndex
CREATE INDEX "meals_mealType_idx" ON "meals"("mealType");

-- CreateIndex
CREATE INDEX "meals_favorite_idx" ON "meals"("favorite");

-- CreateIndex
CREATE INDEX "meals_deletedAt_idx" ON "meals"("deletedAt");

-- CreateIndex
CREATE INDEX "meal_entries_userId_mealDate_idx" ON "meal_entries"("userId", "mealDate");

-- CreateIndex
CREATE INDEX "meal_entries_mealId_idx" ON "meal_entries"("mealId");

-- CreateIndex
CREATE INDEX "meal_entries_deletedAt_idx" ON "meal_entries"("deletedAt");

-- CreateIndex
CREATE INDEX "nutrition_goals_userId_effectiveFrom_idx" ON "nutrition_goals"("userId", "effectiveFrom");

-- CreateIndex
CREATE INDEX "nutrition_goals_deletedAt_idx" ON "nutrition_goals"("deletedAt");

-- CreateIndex
CREATE INDEX "body_progress_entries_userId_entryDate_idx" ON "body_progress_entries"("userId", "entryDate");

-- CreateIndex
CREATE INDEX "body_progress_entries_deletedAt_idx" ON "body_progress_entries"("deletedAt");

-- CreateIndex
CREATE INDEX "habit_logs_logDate_idx" ON "habit_logs"("logDate");

-- CreateIndex
CREATE UNIQUE INDEX "habit_logs_userId_logDate_key" ON "habit_logs"("userId", "logDate");

-- CreateIndex
CREATE INDEX "analytics_snapshots_userId_name_period_idx" ON "analytics_snapshots"("userId", "name", "period");

-- CreateIndex
CREATE UNIQUE INDEX "settings_userId_key" ON "settings"("userId");
