import { addDays, format, startOfWeek } from 'date-fns';
import { Copy, Plus } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { useSchedules } from '@/hooks/useFitnessData';

export function WeeklyPlannerPage() {
  const schedulesQuery = useSchedules();
  const schedules = schedulesQuery.data ?? [];
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  return (
    <>
      <PageHeader
        eyebrow="Planner"
        title="Weekly Planner"
        description="Arrange workouts across the week with room for templates, recurrence, and rest days."
        action={
          <>
            <Button icon={<Copy className="h-4 w-4" aria-hidden />} variant="secondary">
              Duplicate
            </Button>
            <Button icon={<Plus className="h-4 w-4" aria-hidden />}>Add Workout</Button>
          </>
        }
      />
      <div className="grid gap-4 xl:grid-cols-7">
        {days.map((day) => {
          const dayItems = schedules.filter(
            (item) => new Date(item.scheduledDate).getDay() === day.getDay(),
          );

          return (
            <Panel key={day.toISOString()} className="min-h-72">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss dark:text-mint">
                  {format(day, 'EEE')}
                </p>
                <h2 className="mt-1 text-xl font-bold text-ink dark:text-white">{format(day, 'MMM d')}</h2>
              </div>
              <div className="space-y-3">
                {dayItems.length > 0 ? (
                  dayItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-md border border-ink/10 bg-cloud p-3 dark:border-white/10 dark:bg-white/10"
                    >
                      <p className="text-sm font-semibold text-ink dark:text-white">{item.workout?.name}</p>
                      <p className="mt-1 text-xs text-ink/55 dark:text-white/55">
                        {item.targetSets ? `${item.targetSets} sets` : 'Timed'}
                        {item.targetReps ? ` x ${item.targetReps}` : ''}
                      </p>
                      <div className="mt-3">
                        <Badge tone={item.status === 'COMPLETED' ? 'success' : 'neutral'}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-md border border-dashed border-ink/15 p-4 text-sm text-ink/55 dark:border-white/15 dark:text-white/55">
                    Rest day
                  </p>
                )}
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
