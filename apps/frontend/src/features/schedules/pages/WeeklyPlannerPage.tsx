import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDays, format, startOfWeek } from 'date-fns';
import { Copy, Plus } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/components/common/ToastProvider';
import { SelectField } from '@/components/forms/SelectField';
import { TextField } from '@/components/forms/TextField';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Panel } from '@/components/ui/Panel';
import { useSchedules, useWorkouts } from '@/hooks/useFitnessData';
import { fitnessApi } from '@/services/fitnessApi';
import type { ScheduledWorkout } from '@fitness-tracker/shared-types';

type ScheduleForm = {
  notes: string;
  scheduledDate: string;
  targetReps: string;
  targetSets: string;
  targetWeight: string;
  workoutId: string;
};

const todayInputValue = new Date().toISOString().slice(0, 10);

const initialForm: ScheduleForm = {
  notes: '',
  scheduledDate: todayInputValue,
  targetReps: '8',
  targetSets: '4',
  targetWeight: '',
  workoutId: '',
};

export function WeeklyPlannerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const schedulesQuery = useSchedules();
  const workoutsQuery = useWorkouts();
  const schedules = schedulesQuery.data ?? [];
  const workouts = workoutsQuery.data ?? [];
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const createSchedule = useMutation({
    mutationFn: fitnessApi.schedules.create,
    onSuccess: (scheduledWorkout) => {
      queryClient.setQueryData<ScheduledWorkout[]>(['schedules'], (current) => [
        ...(current ?? []),
        scheduledWorkout,
      ]);
      setForm(initialForm);
      setIsModalOpen(false);
      notify({ title: 'Workout scheduled' });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedWorkoutId = form.workoutId || workouts[0]?.id;

    if (!selectedWorkoutId) {
      return;
    }

    createSchedule.mutate({
      workoutId: selectedWorkoutId,
      scheduledDate: new Date(`${form.scheduledDate}T09:00:00`).toISOString(),
      position: schedules.length + 1,
      targetSets: form.targetSets ? Number(form.targetSets) : undefined,
      targetReps: form.targetReps ? Number(form.targetReps) : undefined,
      targetWeight: form.targetWeight ? Number(form.targetWeight) : undefined,
      notes: form.notes || undefined,
    });
  };

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
            <Button
              icon={<Plus className="h-4 w-4" aria-hidden />}
              onClick={() => setIsModalOpen(true)}
            >
              Add Workout
            </Button>
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
                <h2 className="mt-1 text-xl font-bold text-ink dark:text-white">
                  {format(day, 'MMM d')}
                </h2>
              </div>
              <div className="space-y-3">
                {dayItems.length > 0 ? (
                  dayItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-md border border-ink/10 bg-cloud p-3 dark:border-white/10 dark:bg-white/10"
                    >
                      <p className="text-sm font-semibold text-ink dark:text-white">
                        {item.workout?.name}
                      </p>
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
      <Modal
        description="Choose a workout and add target work to the weekly plan."
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        title="Add Workout To Plan"
      >
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <SelectField
            label="Workout"
            onChange={(event) =>
              setForm((current) => ({ ...current, workoutId: event.target.value }))
            }
            options={workouts.map((workout) => ({ label: workout.name, value: workout.id }))}
            required
            value={form.workoutId || workouts[0]?.id || ''}
          />
          <TextField
            label="Date"
            onChange={(event) =>
              setForm((current) => ({ ...current, scheduledDate: event.target.value }))
            }
            required
            type="date"
            value={form.scheduledDate}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField
              label="Sets"
              min="1"
              onChange={(event) =>
                setForm((current) => ({ ...current, targetSets: event.target.value }))
              }
              type="number"
              value={form.targetSets}
            />
            <TextField
              label="Reps"
              min="1"
              onChange={(event) =>
                setForm((current) => ({ ...current, targetReps: event.target.value }))
              }
              type="number"
              value={form.targetReps}
            />
            <TextField
              label="Weight"
              min="0"
              onChange={(event) =>
                setForm((current) => ({ ...current, targetWeight: event.target.value }))
              }
              type="number"
              value={form.targetWeight}
            />
          </div>
          <TextField
            label="Notes"
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            value={form.notes}
          />
          <div className="flex justify-end gap-3">
            <Button onClick={() => setIsModalOpen(false)} type="button" variant="secondary">
              Cancel
            </Button>
            <Button disabled={createSchedule.isPending || workouts.length === 0} type="submit">
              Add Workout
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
