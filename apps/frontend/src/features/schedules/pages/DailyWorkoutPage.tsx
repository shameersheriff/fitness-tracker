import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDays, format, isToday } from 'date-fns';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Play,
  Trash2,
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/components/common/ToastProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Panel } from '@/components/ui/Panel';
import { useTodaySchedules } from '@/hooks/useFitnessData';
import { fitnessApi } from '@/services/fitnessApi';
import type { ScheduledWorkout } from '@fitness-tracker/shared-types';

export function DailyWorkoutPage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [scheduleToComplete, setScheduleToComplete] = useState<ScheduledWorkout | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const schedulesQuery = useTodaySchedules(dateStr);
  const schedules = schedulesQuery.data ?? [];

  const dayLabel = isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMM d');

  const reorderSchedules = useMutation({
    mutationFn: fitnessApi.schedules.reorderByDate,
    onSuccess: (updatedSchedules) => {
      queryClient.setQueryData<ScheduledWorkout[]>(['schedules', 'day', dateStr], updatedSchedules);
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
  const completeSchedule = useMutation({
    mutationFn: fitnessApi.schedules.complete,
    onSuccess: (updatedSchedule) => {
      queryClient.setQueryData<ScheduledWorkout[]>(['schedules', 'day', dateStr], (current) =>
        (current ?? []).map((item) => (item.id === updatedSchedule.id ? updatedSchedule : item)),
      );
      queryClient.setQueryData<ScheduledWorkout[]>(['schedules'], (current) =>
        (current ?? []).map((item) => (item.id === updatedSchedule.id ? updatedSchedule : item)),
      );
      void queryClient.invalidateQueries({ queryKey: ['dashboard', 'today'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard', 'weekly-summary'] });
      notify({ title: 'Workout completed' });
    },
  });
  const deleteSchedule = useMutation({
    mutationFn: fitnessApi.schedules.remove,
    onSuccess: (_deleted, id) => {
      queryClient.setQueryData<ScheduledWorkout[]>(['schedules', 'day', dateStr], (current) =>
        (current ?? []).filter((item) => item.id !== id),
      );
      queryClient.setQueryData<ScheduledWorkout[]>(['schedules'], (current) =>
        (current ?? []).filter((item) => item.id !== id),
      );
      notify({ title: 'Workout removed from planner' });
    },
  });

  const handleDeleteSchedule = (item: ScheduledWorkout) => {
    const confirmed = window.confirm(
      `Remove ${item.workout?.name ?? 'this workout'} from the planner?`,
    );

    if (confirmed) {
      deleteSchedule.mutate(item.id);
    }
  };

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
    const isoDate = new Date(selectedDate);
    isoDate.setHours(0, 0, 0, 0);
    reorderSchedules.mutate({
      date: isoDate.toISOString(),
      scheduleIds: reordered.map((item) => item.id),
    });
  };

  const handleConfirmComplete = () => {
    if (!scheduleToComplete) {
      return;
    }

    completeSchedule.mutate(scheduleToComplete.id, {
      onSuccess: () => {
        setScheduleToComplete(null);
      },
    });
  };

  return (
    <>
      <PageHeader
        eyebrow={dayLabel}
        title="Daily Workout View"
        description="Execute the planned session and keep target work visible while logging actuals."
        action={
          <div className="flex items-center gap-2">
            <Button
              aria-label="Previous day"
              icon={<ChevronLeft className="h-4 w-4" aria-hidden />}
              onClick={() => setSelectedDate((d) => addDays(d, -1))}
              variant="ghost"
            />
            <Button
              aria-label="Next day"
              disabled={isToday(selectedDate)}
              icon={<ChevronRight className="h-4 w-4" aria-hidden />}
              onClick={() => setSelectedDate((d) => addDays(d, 1))}
              variant="ghost"
            />
            <Button
              icon={isEditMode ? undefined : <Pencil className="h-4 w-4" aria-hidden />}
              onClick={() => setIsEditMode((value) => !value)}
              variant={isEditMode ? 'primary' : 'secondary'}
            >
              {isEditMode ? 'Done' : 'Edit'}
            </Button>
          </div>
        }
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
                {isEditMode && (
                  <>
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
                    <Button
                      icon={<Trash2 className="h-4 w-4" aria-hidden />}
                      onClick={() => handleDeleteSchedule(item)}
                      type="button"
                      variant="ghost"
                    >
                      Delete
                    </Button>
                  </>
                )}
                <Button icon={<Play className="h-4 w-4" aria-hidden />}>Start</Button>
                <Button
                  disabled={item.status === 'COMPLETED' || completeSchedule.isPending}
                  icon={<CheckCircle2 className="h-4 w-4" aria-hidden />}
                  onClick={() => setScheduleToComplete(item)}
                  type="button"
                  variant="secondary"
                >
                  Complete
                </Button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
      <Modal
        description={
          scheduleToComplete
            ? `Mark ${scheduleToComplete.workout?.name ?? 'this workout'} as completed?`
            : 'Mark this workout as completed?'
        }
        footer={
          <>
            <Button onClick={() => setScheduleToComplete(null)} type="button" variant="secondary">
              No
            </Button>
            <Button
              disabled={!scheduleToComplete || completeSchedule.isPending}
              onClick={handleConfirmComplete}
              type="button"
            >
              Yes
            </Button>
          </>
        }
        onClose={() => setScheduleToComplete(null)}
        open={Boolean(scheduleToComplete)}
        title="Complete Workout"
      >
        <p className="text-sm leading-6 text-ink/70 dark:text-white/70">
          Completing a workout updates its status and today&apos;s progress summary.
        </p>
      </Modal>
    </>
  );
}
