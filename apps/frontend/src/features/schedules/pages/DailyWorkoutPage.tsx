import { CheckCircle2, Play } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { useTodaySchedules } from '@/hooks/useFitnessData';

export function DailyWorkoutPage() {
  const schedulesQuery = useTodaySchedules();
  const schedules = schedulesQuery.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Today"
        title="Daily Workout View"
        description="Execute the planned session and keep target work visible while logging actuals."
      />
      <div className="space-y-4">
        {schedules.map((item) => (
          <Panel key={item.id}>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-ink dark:text-white">
                    {item.workout?.name}
                  </h2>
                  <Badge tone={item.status === 'COMPLETED' ? 'success' : 'neutral'}>
                    {item.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/60 dark:text-white/60">
                  {item.workout?.instructions}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button icon={<Play className="h-4 w-4" aria-hidden />}>Start</Button>
                <Button icon={<CheckCircle2 className="h-4 w-4" aria-hidden />} variant="secondary">
                  Complete
                </Button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
