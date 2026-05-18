import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@fitness-tracker.local' },
    update: {},
    create: {
      id: 'demo-user',
      firstName: 'Demo',
      lastName: 'Athlete',
      email: 'demo@fitness-tracker.local',
      age: 32,
      gender: 'PREFER_NOT_TO_SAY',
      height: 70,
      currentWeight: 184.8,
      targetWeight: 178,
      activityLevel: 'ACTIVE',
      goalType: 'STRENGTH_GAIN',
    },
  });

  await prisma.workoutSessionSet.deleteMany({
    where: { session: { userId: user.id } },
  });
  await prisma.workoutSession.deleteMany({ where: { userId: user.id } });
  await prisma.scheduledWorkout.deleteMany({ where: { userId: user.id } });
  await prisma.mealEntry.deleteMany({ where: { userId: user.id } });
  await prisma.meal.deleteMany({ where: { userId: user.id } });
  await prisma.nutritionGoal.deleteMany({ where: { userId: user.id } });
  await prisma.bodyProgressEntry.deleteMany({ where: { userId: user.id } });
  await prisma.workoutTemplate.deleteMany({ where: { userId: user.id } });
  await prisma.workout.deleteMany({ where: { userId: user.id } });

  const strength = await prisma.workoutType.upsert({
    where: { userId_name: { userId: user.id, name: 'Strength' } },
    update: {},
    create: {
      userId: user.id,
      name: 'Strength',
      description: 'Progressive overload with sets, reps, and load.',
      trackingType: 'SETS_REPS',
    },
  });

  const cardio = await prisma.workoutType.upsert({
    where: { userId_name: { userId: user.id, name: 'Cardio' } },
    update: {},
    create: {
      userId: user.id,
      name: 'Cardio',
      description: 'Aerobic conditioning tracked by time and distance.',
      trackingType: 'TIME',
    },
  });

  const bench = await prisma.workout.create({
    data: {
      userId: user.id,
      workoutTypeId: strength.id,
      name: 'Bench Press',
      description: 'Primary horizontal press.',
      instructions: 'Retract shoulders, brace hard, and press with control.',
      muscleGroup: 'CHEST',
      equipmentType: 'BARBELL',
    },
  });

  const squat = await prisma.workout.create({
    data: {
      userId: user.id,
      workoutTypeId: strength.id,
      name: 'Back Squat',
      description: 'Primary lower-body strength lift.',
      instructions: 'Brace, descend under control, and drive through midfoot.',
      muscleGroup: 'LEGS',
      equipmentType: 'BARBELL',
    },
  });

  const run = await prisma.workout.create({
    data: {
      userId: user.id,
      workoutTypeId: cardio.id,
      name: 'Zone 2 Run',
      description: 'Aerobic base run.',
      instructions: 'Hold a conversational pace.',
      muscleGroup: 'CARDIO',
      equipmentType: 'NONE',
    },
  });

  const today = new Date();
  today.setHours(9, 0, 0, 0);

  await prisma.scheduledWorkout.createMany({
    data: [
      {
        userId: user.id,
        workoutId: bench.id,
        scheduledDate: today,
        position: 1,
        targetSets: 4,
        targetReps: 8,
        targetWeight: 185,
      },
      {
        userId: user.id,
        workoutId: squat.id,
        scheduledDate: today,
        position: 2,
        targetSets: 5,
        targetReps: 5,
        targetWeight: 245,
        status: 'COMPLETED',
        completedAt: today,
      },
      {
        userId: user.id,
        workoutId: run.id,
        scheduledDate: today,
        position: 3,
        targetDurationSeconds: 1800,
        targetDistanceKm: 5,
      },
    ],
  });

  await prisma.meal.createMany({
    data: [
      {
        userId: user.id,
        title: 'Greek Yogurt Bowl',
        description: 'Greek yogurt, berries, oats, and honey.',
        mealType: 'BREAKFAST',
        protein: 42,
        carbs: 58,
        fats: 12,
        calories: 505,
        fiber: 8,
        sugar: 22,
        sodium: 170,
        mealDate: today,
        favorite: true,
      },
      {
        userId: user.id,
        title: 'Chicken Rice Plate',
        description: 'Chicken breast, jasmine rice, avocado, and salsa.',
        mealType: 'LUNCH',
        protein: 56,
        carbs: 72,
        fats: 21,
        calories: 701,
        fiber: 9,
        sugar: 7,
        sodium: 610,
        mealDate: today,
      },
    ],
  });

  await prisma.nutritionGoal.create({
    data: {
      userId: user.id,
      dailyCalories: 2600,
      protein: 190,
      carbs: 285,
      fats: 82,
      waterMl: 3200,
      effectiveFrom: today,
    },
  });

  await prisma.bodyProgressEntry.createMany({
    data: [
      {
        userId: user.id,
        entryDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        bodyWeight: 184.8,
        waist: 33.8,
        chest: 42,
        arms: 15.4,
        thighs: 24.6,
        hips: 39.4,
        bodyFatPercentage: 17.8,
      },
      {
        userId: user.id,
        entryDate: today,
        bodyWeight: 183.6,
        waist: 33.5,
        chest: 42.1,
        arms: 15.5,
        thighs: 24.7,
        hips: 39.2,
        bodyFatPercentage: 17.2,
      },
    ],
  });

  await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      theme: 'system',
      unitSystem: 'IMPERIAL',
      distanceUnit: 'MI',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
