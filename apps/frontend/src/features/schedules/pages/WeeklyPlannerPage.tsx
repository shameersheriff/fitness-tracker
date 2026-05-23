import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDays, addWeeks, endOfDay, format, isSameDay, startOfWeek } from 'date-fns';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Copy,
  Plus,
  Trash2,
  Pencil,
} from 'lucide-react';

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
import {
  equipmentTypes,
  muscleGroups,
  type ScheduledWorkout,
  type Workout,
} from '@fitness-tracker/shared-types';

type ScheduleForm = {
  notes: string;
  scheduledDate: string;
  targetReps: string;
  targetSets: string;
  targetWeight: string;
  workoutId: string;
};

type WorkoutForm = {
  description: string;
  equipmentType: Workout['equipmentType'];
  instructions: string;
  muscleGroup: Workout['muscleGroup'];
  name: string;
};

const todayInputValue = new Date().toISOString().slice(0, 10);

const initialForm: ScheduleForm = {
  notes: '',
  scheduledDate: todayInputValue,
  targetReps: '10',
  targetSets: '4',
  targetWeight: '',
  workoutId: '',
};

const initialWorkoutForm: WorkoutForm = {
  description: '',
  equipmentType: 'BARBELL',
  instructions: '',
  muscleGroup: 'CHEST',
  name: '',
};

export function WeeklyPlannerPage() {
  const [isCreateWorkoutModalOpen, setIsCreateWorkoutModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [workoutForm, setWorkoutForm] = useState(initialWorkoutForm);
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const weekEnd = days[6]!;
  const schedulesQuery = useSchedules({
    from: weekStart.toISOString(),
    to: endOfDay(weekEnd).toISOString(),
  });
  const workoutsQuery = useWorkouts();
  const schedules = schedulesQuery.data ?? [];
  const workouts = workoutsQuery.data ?? [];
  const weekLabel = `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d, yyyy')}`;
  const createSchedule = useMutation({
    mutationFn: fitnessApi.schedules.create,
    onSuccess: (scheduledWorkout) => {
      queryClient.setQueriesData<ScheduledWorkout[]>({ queryKey: ['schedules'] }, (current) => {
        if (!current) {
          return current;
        }

        return [...current, scheduledWorkout];
      });
      setForm(initialForm);
      setIsModalOpen(false);
      notify({ title: 'Workout scheduled' });
    },
  });
  const createWorkout = useMutation({
    mutationFn: fitnessApi.workouts.create,
    onSuccess: (workout) => {
      queryClient.setQueryData<Workout[]>(['workouts'], (current) => [workout, ...(current ?? [])]);
      setForm((current) => ({ ...current, workoutId: workout.id }));
      setWorkoutForm(initialWorkoutForm);
      setIsCreateWorkoutModalOpen(false);
      notify({ title: 'Workout created' });
    },
  });
  const deleteSchedule = useMutation({
    mutationFn: fitnessApi.schedules.remove,
    onSuccess: (_deleted, id) => {
      queryClient.setQueriesData<ScheduledWorkout[]>({ queryKey: ['schedules'] }, (current) =>
        (current ?? []).filter((item) => item.id !== id),
      );
      notify({ title: 'Workout removed from planner' });
    },
  });
  const reorderByDate = useMutation({
    mutationFn: fitnessApi.schedules.reorderByDate,
    onSuccess: (updatedSchedules) => {
      queryClient.setQueriesData<ScheduledWorkout[]>({ queryKey: ['schedules'] }, (current) => {
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

  const handleCreateWorkoutSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createWorkout.mutate({
      description: workoutForm.description.trim() || undefined,
      equipmentType: workoutForm.equipmentType,
      instructions: workoutForm.instructions.trim() || undefined,
      muscleGroup: workoutForm.muscleGroup,
      name: workoutForm.name.trim(),
    });
  };

  const handleDeleteSchedule = (item: ScheduledWorkout) => {
    const confirmed = window.confirm(
      `Remove ${item.workout?.name ?? 'this workout'} from the planner?`,
    );

    if (confirmed) {
      deleteSchedule.mutate(item.id);
    }
  };

  const handleOpenAddForDay = (day: Date) => {
    setForm((current) => ({ ...current, scheduledDate: format(day, 'yyyy-MM-dd') }));
    setIsModalOpen(true);
  };

  const handleMoveWithinDay = (day: Date, index: number, direction: -1 | 1) => {
    const dayItems = schedules
      .filter((item) => isSameDay(new Date(item.scheduledDate), day))
      .sort((a, b) => a.position - b.position);
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= dayItems.length || reorderByDate.isPending) {
      return;
    }

    const reordered = [...dayItems];
    const currentItem = reordered[index];
    const targetItem = reordered[targetIndex];

    if (!currentItem || !targetItem) {
      return;
    }

    reordered[index] = targetItem;
    reordered[targetIndex] = currentItem;
    // Send date as ISO string at midnight for backend matching
    const isoDate = new Date(day);
    isoDate.setHours(0, 0, 0, 0);
    reorderByDate.mutate({
      date: isoDate.toISOString(),
      scheduleIds: reordered.map((item) => item.id),
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Planner"
        title="Weekly Planner"
        description="Arrange workouts across the week with room for templates, recurrence, and rest days."
        action={
          <div className="flex flex-col w-full mt-2">
            <div className="flex items-center justify-end gap-2">
              <Button
                aria-label="Previous week"
                icon={<ChevronLeft className="h-4 w-4" aria-hidden />}
                onClick={() => setWeekOffset((n) => n - 1)}
                variant="ghost"
              />
              <span className="whitespace-nowrap text-sm font-medium text-ink/70 dark:text-white/70">
                {weekLabel}
              </span>
              <Button
                aria-label="Next week"
                icon={<ChevronRight className="h-4 w-4" aria-hidden />}
                onClick={() => setWeekOffset((n) => n + 1)}
                variant="ghost"
              />
            </div>
            <div className="flex flex-row justify-end w-full mt-2">
              <div className="flex items-center gap-2">
                {weekOffset !== 0 ? (
                  <Button onClick={() => setWeekOffset(0)} variant="secondary">
                    Current week
                  </Button>
                ) : null}
                <Button
                  icon={isEditMode ? undefined : <Pencil className="h-4 w-4" aria-hidden />}
                  variant={isEditMode ? 'primary' : 'secondary'}
                  onClick={() => setIsEditMode((v) => !v)}
                >
                  {isEditMode ? 'Done' : 'Edit'}
                </Button>
                <Button
                  icon={<Plus className="h-4 w-4" aria-hidden />}
                  onClick={() => {
                    const defaultDate =
                      isSameDay(weekStart, startOfWeek(new Date(), { weekStartsOn: 1 })) ||
                      weekOffset < 0
                        ? todayInputValue
                        : format(weekStart, 'yyyy-MM-dd');
                    setForm((current) => ({ ...current, scheduledDate: defaultDate }));
                    setIsModalOpen(true);
                  }}
                >
                  Add Workout
                </Button>
              </div>
            </div>
          </div>
        }
      />
      <div className="grid gap-4 xl:grid-cols-7">
        {days.map((day) => {
          const dayItems = schedules
            .filter((item) => isSameDay(new Date(item.scheduledDate), day))
            .sort((a, b) => a.position - b.position);

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
                  dayItems.map((item, index) => (
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
                      <div className="mt-3 flex items-center justify-between gap-1">
                        <div className="flex flex-col gap-2">
                          <Badge tone={item.status === 'COMPLETED' ? 'success' : 'neutral'}>
                            {item.status}
                          </Badge>

                          {isEditMode && (
                            <div className="flex items-center gap-0.5">
                              <Button
                                aria-label="Move workout up"
                                className="h-7 w-7 min-h-7 p-0"
                                disabled={index === 0 || reorderByDate.isPending}
                                icon={<ArrowUp className="h-3.5 w-3.5" aria-hidden />}
                                onClick={() => handleMoveWithinDay(day, index, -1)}
                                type="button"
                                variant="ghost"
                              />
                              <Button
                                aria-label="Move workout down"
                                className="h-7 w-7 min-h-7 p-0"
                                disabled={index === dayItems.length - 1 || reorderByDate.isPending}
                                icon={<ArrowDown className="h-3.5 w-3.5" aria-hidden />}
                                onClick={() => handleMoveWithinDay(day, index, 1)}
                                type="button"
                                variant="ghost"
                              />
                              <Button
                                aria-label="Delete workout"
                                className="h-7 w-7 min-h-7 p-0"
                                icon={<Trash2 className="h-3.5 w-3.5" aria-hidden />}
                                onClick={() => handleDeleteSchedule(item)}
                                type="button"
                                variant="ghost"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-md border border-dashed border-ink/15 p-4 text-sm text-ink/55 dark:border-white/15 dark:text-white/55">
                    Rest day
                  </p>
                )}
              </div>
              <div className="mt-4">
                <Button
                  className="w-full"
                  icon={<Plus className="h-3.5 w-3.5" aria-hidden />}
                  onClick={() => handleOpenAddForDay(day)}
                  type="button"
                  variant="secondary"
                >
                  Add Workout
                </Button>
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
          <div className="flex justify-end">
            <Button
              onClick={() => setIsCreateWorkoutModalOpen(true)}
              type="button"
              variant="secondary"
            >
              Create Workout
            </Button>
          </div>
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
      <Modal
        description="Create a workout in your library, then attach it to the weekly plan."
        onClose={() => {
          setIsCreateWorkoutModalOpen(false);
          setWorkoutForm(initialWorkoutForm);
        }}
        open={isCreateWorkoutModalOpen}
        title="Create Workout"
      >
        <form className="grid gap-4" onSubmit={handleCreateWorkoutSubmit}>
          <TextField
            label="Workout name"
            onChange={(event) =>
              setWorkoutForm((current) => ({ ...current, name: event.target.value }))
            }
            required
            value={workoutForm.name}
          />
          <TextField
            label="Description"
            onChange={(event) =>
              setWorkoutForm((current) => ({ ...current, description: event.target.value }))
            }
            value={workoutForm.description}
          />
          <SelectField
            label="Muscle group"
            onChange={(event) =>
              setWorkoutForm((current) => ({
                ...current,
                muscleGroup: event.target.value as Workout['muscleGroup'],
              }))
            }
            options={muscleGroups.map((group) => ({
              label: group.replace('_', ' '),
              value: group,
            }))}
            value={workoutForm.muscleGroup}
          />
          <SelectField
            label="Equipment"
            onChange={(event) =>
              setWorkoutForm((current) => ({
                ...current,
                equipmentType: event.target.value as Workout['equipmentType'],
              }))
            }
            options={equipmentTypes.map((type) => ({ label: type.replace('_', ' '), value: type }))}
            value={workoutForm.equipmentType}
          />
          <label className="block">
            <span className="text-sm font-semibold text-ink dark:text-white">Instructions</span>
            <textarea
              className="mt-2 min-h-24 w-full rounded-md border border-ink/10 bg-white px-3 py-2 text-sm text-ink shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
              onChange={(event) =>
                setWorkoutForm((current) => ({ ...current, instructions: event.target.value }))
              }
              value={workoutForm.instructions}
            />
          </label>
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => {
                setIsCreateWorkoutModalOpen(false);
                setWorkoutForm(initialWorkoutForm);
              }}
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
            <Button disabled={createWorkout.isPending} type="submit">
              Save Workout
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
