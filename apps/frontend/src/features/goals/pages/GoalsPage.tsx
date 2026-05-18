import { Plus, Target } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { useDashboardToday, useGoals } from '@/hooks/useFitnessData';
import { percent } from '@/utils/formatters';

export function GoalsPage() {
  const goalsQuery = useGoals();
  const dashboardQuery = useDashboardToday();
  const goal = goalsQuery.data?.[0];
  const macros = dashboardQuery.data?.macros;

  const goals = [
    ['Calories', macros?.calories ?? 0, goal?.dailyCalories ?? 0],
    ['Protein', macros?.protein ?? 0, goal?.protein ?? 0],
    ['Carbs', macros?.carbs ?? 0, goal?.carbs ?? 0],
    ['Fat', macros?.fats ?? 0, goal?.fats ?? 0],
  ];

  return (
    <>
      <PageHeader
        eyebrow="Targets"
        title="Goals"
        description="Daily nutrition and body-composition targets prepared for longer term goal cycles."
        action={<Button icon={<Plus className="h-4 w-4" aria-hidden />}>New Goal</Button>}
      />
      <Panel>
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-mint/20 text-moss dark:text-mint">
              <Target className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink dark:text-white">Current Nutrition Goal</h2>
              <p className="text-sm text-ink/60 dark:text-white/60">Effective from today</p>
            </div>
          </div>
          <Badge tone="success">Active</Badge>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {goals.map(([label, consumed, target]) => {
            const value = target ? ((consumed as number) / (target as number)) * 100 : 0;
            return (
              <div key={label as string}>
                <div className="mb-2 flex justify-between text-sm font-medium">
                  <span>{label}</span>
                  <span>
                    {consumed}/{target} {label === 'Calories' ? 'cal' : 'g'}
                  </span>
                </div>
                <ProgressBar value={value} />
                <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{percent(value)} complete</p>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}
