import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, CheckCircle2, Play } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/components/common/ToastProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { useTodaySchedules } from '@/hooks/useFitnessData';
import { fitnessApi } from '@/services/fitnessApi';
import type { ScheduledWorkout } from '@fitness-tracker/shared-types';

export function DailyWorkoutPage() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const schedulesQuery = useTodaySchedules();
  const schedules = schedulesQuery.data ?? [];

  const reorderSchedules = useMutation({
    mutationFn: fitnessApi.schedules.reorderToday,
    onSuccess: (updatedSchedules) => {
      queryClient.setQueryData<ScheduledWorkout[]>(['schedules', 'today'], updatedSchedules);
      queryClient.setQueryData<ScheduledWorkout[]>(['schedules'], (current) => {
        if (!current) {
          return current;
        }

        const updatedById = new Map(updatedSchedules.map((item) => [item.id, item]));

        return current
          .map((item) => updatedById.get(item.id) ?? item)
          .sort((a, b) => {
            const dateDiff =
              new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
            if (dateDiff !== 0) {
              return dateDiff;
            }

            return a.position - b.position;
          });
      });
      notify({ title: 'Workout order updated' });
    },
  });

  const handleMove = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= schedules.length || reorderSchedules.isPending) {
      return;
    }

    const reordered = [...schedules];
    const currentItem = reordered[index];
    const targetItem = reordered[targetIndex];

    if (!currentItem || !targetItem) {
      return;
    }

    reordered[index] = targetItem;
    reordered[targetIndex] = currentItem;
    reorderSchedules.mutate({ scheduleIds: reordered.map((item) => item.id) });
  };

  return (
    <>
      <PageHeader
        eyebrow="Today"
        title="Daily Workout View"
        description="Execute the planned session and keep target work visible while logging actuals."
      />
      <div className="space-y-4">
        {schedules.map((item, index) => (
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
                <Button
                  aria-label="Move workout up"
                  disabled={index === 0 || reorderSchedules.isPending}
                  icon={<ArrowUp className="h-4 w-4" aria-hidden />}
                  onClick={() => handleMove(index, -1)}
                  variant="ghost"
                >
                  Up
                </Button>
                <Button
                  aria-label="Move workout down"
                  disabled={index === schedules.length - 1 || reorderSchedules.isPending}
                  icon={<ArrowDown className="h-4 w-4" aria-hidden />}
                  onClick={() => handleMove(index, 1)}
                  variant="ghost"
                >
                  Down
                </Button>
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
