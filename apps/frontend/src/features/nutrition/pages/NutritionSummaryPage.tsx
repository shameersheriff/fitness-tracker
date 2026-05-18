import { Droplets, Flame, Wheat } from 'lucide-react';

import { MetricBarChart } from '@/components/charts/MetricBarChart';
import { PageHeader } from '@/components/common/PageHeader';
import { ProgressBar } from '@/components/common/ProgressBar';
import { StatTile } from '@/components/common/StatTile';
import { Panel } from '@/components/ui/Panel';
import { useDashboardToday, useGoals, useNutritionAnalytics } from '@/hooks/useFitnessData';
import { percent } from '@/utils/formatters';

export function NutritionSummaryPage() {
  const dashboardQuery = useDashboardToday();
  const goalsQuery = useGoals();
  const nutritionQuery = useNutritionAnalytics();
  const dashboard = dashboardQuery.data;
  const goal = goalsQuery.data?.[0] ?? dashboard?.nutritionGoal;

  const caloriePercent = goal ? (dashboard?.macros.calories ?? 0) / goal.dailyCalories * 100 : 0;
  const proteinPercent = goal ? (dashboard?.macros.protein ?? 0) / goal.protein * 100 : 0;
  const carbPercent = goal ? (dashboard?.macros.carbs ?? 0) / goal.carbs * 100 : 0;
  const fatPercent = goal ? (dashboard?.macros.fats ?? 0) / goal.fats * 100 : 0;

  return (
    <>
      <PageHeader
        eyebrow="Macros"
        title="Nutrition Summary"
        description="Daily targets, remaining intake, and macro consistency over time."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatTile icon={<Flame className="h-5 w-5" />} label="Calories" value={`${dashboard?.macros.calories ?? 0}`} detail={`${percent(caloriePercent)} of target`} />
        <StatTile icon={<Wheat className="h-5 w-5" />} label="Protein" value={`${dashboard?.macros.protein ?? 0}g`} detail={`${percent(proteinPercent)} of target`} />
        <StatTile icon={<Droplets className="h-5 w-5" />} label="Water Goal" value={`${goal?.waterMl ?? 0} ml`} detail="Daily hydration target" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel>
          <h2 className="text-lg font-bold text-ink dark:text-white">Macro Completion</h2>
          <div className="mt-5 space-y-5">
            {[
              ['Protein', proteinPercent],
              ['Carbs', carbPercent],
              ['Fat', fatPercent],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="mb-2 flex justify-between text-sm font-medium">
                  <span>{label}</span>
                  <span>{percent(value as number)}</span>
                </div>
                <ProgressBar value={value as number} />
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-4 text-lg font-bold text-ink dark:text-white">Calories Trend</h2>
          <MetricBarChart data={nutritionQuery.data ?? []} color="#e8a93d" />
        </Panel>
      </div>
    </>
  );
}
