import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppLayout } from '@/components/layouts/AppLayout';
import { AnalyticsPage } from '@/features/analytics/pages/AnalyticsPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { GoalsPage } from '@/features/goals/pages/GoalsPage';
import { MealTrackerPage } from '@/features/meals/pages/MealTrackerPage';
import { NutritionSummaryPage } from '@/features/nutrition/pages/NutritionSummaryPage';
import { BodyProgressPage } from '@/features/progress/pages/BodyProgressPage';
import { DailyWorkoutPage } from '@/features/schedules/pages/DailyWorkoutPage';
import { WeeklyPlannerPage } from '@/features/schedules/pages/WeeklyPlannerPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';
import { SessionLoggerPage } from '@/features/workout-sessions/pages/SessionLoggerPage';
import { WorkoutTypesPage } from '@/features/workout-types/pages/WorkoutTypesPage';
import { WorkoutFormPage } from '@/features/workouts/pages/WorkoutFormPage';
import { WorkoutListPage } from '@/features/workouts/pages/WorkoutListPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'workouts', element: <WorkoutListPage /> },
      { path: 'workouts/new', element: <WorkoutFormPage /> },
      { path: 'workouts/:id/edit', element: <WorkoutFormPage /> },
      { path: 'workout-types', element: <WorkoutTypesPage /> },
      { path: 'planner/week', element: <WeeklyPlannerPage /> },
      { path: 'planner/day', element: <DailyWorkoutPage /> },
      { path: 'sessions/logger', element: <SessionLoggerPage /> },
      { path: 'meals', element: <MealTrackerPage /> },
      { path: 'nutrition', element: <NutritionSummaryPage /> },
      { path: 'goals', element: <GoalsPage /> },
      { path: 'progress', element: <BodyProgressPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
