import { BarChart3, Dumbbell, LineChart, PieChart } from 'lucide-react';

import { MetricBarChart } from '@/components/charts/MetricBarChart';
import { MetricLineChart } from '@/components/charts/MetricLineChart';
import { PageHeader } from '@/components/common/PageHeader';
import { StatTile } from '@/components/common/StatTile';
import { Panel } from '@/components/ui/Panel';
import {
  useNutritionAnalytics,
  useProgressAnalytics,
  useWeeklySummary,
  useWorkoutAnalytics,
} from '@/hooks/useFitnessData';
import { formatNumber, percent } from '@/utils/formatters';

export function AnalyticsPage() {
  const workoutAnalyticsQuery = useWorkoutAnalytics();
  const nutritionAnalyticsQuery = useNutritionAnalytics();
  const progressAnalyticsQuery = useProgressAnalytics();
  const weeklySummaryQuery = useWeeklySummary();
  const weekly = weeklySummaryQuery.data;

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Analytics"
        description="Training compliance, volume, nutrition, and body composition trends."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatTile
          icon={<Dumbbell className="h-5 w-5" aria-hidden />}
          label="Completion"
          value={weekly ? percent(weekly.completionRate) : '--'}
          detail="Weekly workout rate"
        />
        <StatTile
          icon={<BarChart3 className="h-5 w-5" aria-hidden />}
          label="Volume"
          value={weekly ? formatNumber(weekly.workoutVolume) : '--'}
          detail="Total pounds moved"
        />
        <StatTile
          icon={<PieChart className="h-5 w-5" aria-hidden />}
          label="Protein"
          value={weekly ? `${formatNumber(weekly.proteinConsumed)}g` : '--'}
          detail="Weekly intake"
        />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink dark:text-white">
            <Dumbbell className="h-5 w-5" aria-hidden />
            Muscle Group Distribution
          </h2>
          <MetricBarChart data={workoutAnalyticsQuery.data ?? []} />
        </Panel>
        <Panel>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink dark:text-white">
            <LineChart className="h-5 w-5" aria-hidden />
            Body Weight Trend
          </h2>
          <MetricLineChart data={progressAnalyticsQuery.data ?? []} color="#7a6ff0" />
        </Panel>
        <Panel className="xl:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-ink dark:text-white">Calories Consumed</h2>
          <MetricBarChart data={nutritionAnalyticsQuery.data ?? []} color="#ec6f66" />
        </Panel>
      </div>
    </>
  );
}
