import { Activity, Flame, Salad, Trophy } from 'lucide-react';

import { MetricBarChart } from '@/components/charts/MetricBarChart';
import { PageHeader } from '@/components/common/PageHeader';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Skeleton } from '@/components/common/Skeleton';
import { StatTile } from '@/components/common/StatTile';
import { Badge } from '@/components/ui/Badge';
import { Panel } from '@/components/ui/Panel';
import { useDashboardToday, useNutritionAnalytics, useWeeklySummary } from '@/hooks/useFitnessData';
import { formatNumber, percent } from '@/utils/formatters';

export function DashboardPage() {
  const dashboardQuery = useDashboardToday();
  const weeklyQuery = useWeeklySummary();
  const nutritionQuery = useNutritionAnalytics();

  const dashboard = dashboardQuery.data;
  const weekly = weeklyQuery.data;
  const workouts = dashboard?.workouts ?? [];
  const macros = dashboard?.macros ?? {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
  };
  const goal = dashboard?.nutritionGoal;
  const caloriePercent = goal ? (macros.calories / goal.dailyCalories) * 100 : 0;
  const proteinPercent = goal ? (macros.protein / goal.protein) * 100 : 0;

  return (
    <>
      <PageHeader
        eyebrow="Today"
        title="Dashboard"
        description="Daily training, nutrition, recovery, and body progress in one operational view."
      />

      {dashboardQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile
            detail={`${dashboard?.remainingWorkouts ?? 0} remaining`}
            icon={<Activity className="h-5 w-5" aria-hidden />}
            label="Workouts"
            value={`${dashboard?.completedWorkouts ?? 0}/${workouts.length}`}
          />
          <StatTile
            detail={goal ? `${goal.dailyCalories - macros.calories} remaining` : undefined}
            icon={<Flame className="h-5 w-5" aria-hidden />}
            label="Calories"
            value={formatNumber(macros.calories)}
          />
          <StatTile
            detail={goal ? `${Math.max(goal.protein - macros.protein, 0)} g remaining` : undefined}
            icon={<Salad className="h-5 w-5" aria-hidden />}
            label="Protein"
            value={`${macros.protein} g`}
          />
          <StatTile
            detail="Current workout streak"
            icon={<Trophy className="h-5 w-5" aria-hidden />}
            label="Streak"
            value={`${dashboard?.workoutStreak ?? 0} days`}
          />
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-ink dark:text-white">Today's Workouts</h2>
              <p className="text-sm text-ink/60 dark:text-white/60">
                Planned load and completion status
              </p>
            </div>
            <Badge tone="info">
              {weekly ? `${percent(weekly.completionRate)} weekly` : 'Weekly'}
            </Badge>
          </div>
          <div className="divide-y divide-ink/10 dark:divide-white/10">
            {workouts.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-ink dark:text-white">{item.workout?.name}</p>
                  <p className="mt-1 text-sm text-ink/60 dark:text-white/60">
                    {item.targetSets ? `${item.targetSets} sets` : 'Timed'}
                    {item.targetReps ? ` x ${item.targetReps} reps` : ''}
                    {item.targetWeight ? ` at ${item.targetWeight} lb` : ''}
                    {item.targetDurationSeconds
                      ? ` for ${Math.round(item.targetDurationSeconds / 60)} min`
                      : ''}
                  </p>
                </div>
                <Badge tone={item.status === 'COMPLETED' ? 'success' : 'neutral'}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <h2 className="text-lg font-bold text-ink dark:text-white">Nutrition Targets</h2>
          <div className="mt-5 space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm font-medium">
                <span>Calories</span>
                <span>{percent(caloriePercent)}</span>
              </div>
              <ProgressBar value={caloriePercent} />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm font-medium">
                <span>Protein</span>
                <span>{percent(proteinPercent)}</span>
              </div>
              <ProgressBar value={proteinPercent} />
            </div>
            <div className="rounded-md bg-cloud p-4 dark:bg-white/10">
              <p className="text-sm text-ink/60 dark:text-white/60">Latest body weight</p>
              <p className="mt-1 text-2xl font-bold text-ink dark:text-white">
                {dashboard?.latestProgress?.bodyWeight ?? '--'} lb
              </p>
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-ink dark:text-white">Calories This Week</h2>
            <p className="text-sm text-ink/60 dark:text-white/60">
              Intake trend against the weekly training block
            </p>
          </div>
          <MetricBarChart data={nutritionQuery.data ?? []} color="#ec6f66" />
        </Panel>
      </div>
    </>
  );
}
