import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Plus, Trash2, X } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/components/common/ToastProvider';
import { SelectField } from '@/components/forms/SelectField';
import { TextField } from '@/components/forms/TextField';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Panel } from '@/components/ui/Panel';
import { useSessions, useWorkouts } from '@/hooks/useFitnessData';
import { fitnessApi } from '@/services/fitnessApi';
import type { DifficultyLevel, WorkoutSession } from '@fitness-tracker/shared-types';

type SessionForm = {
  difficulty: DifficultyLevel;
  energyLevel: string;
  notes: string;
  workoutId: string;
};

type SetForm = {
  reps: string;
  weight: string;
  restTimeSeconds: string;
  durationSeconds: string;
};

const initialForm: SessionForm = {
  difficulty: 'MODERATE',
  energyLevel: '7',
  notes: '',
  workoutId: '',
};

const initialSetForm: SetForm = {
  reps: '',
  weight: '',
  restTimeSeconds: '',
  durationSeconds: '',
};

const difficultyOptions: DifficultyLevel[] = [
  'VERY_EASY',
  'EASY',
  'MODERATE',
  'HARD',
  'MAX_EFFORT',
];

const difficultyTones: Record<
  DifficultyLevel,
  'neutral' | 'success' | 'warning' | 'danger' | 'info'
> = {
  VERY_EASY: 'success',
  EASY: 'success',
  MODERATE: 'info',
  HARD: 'warning',
  MAX_EFFORT: 'danger',
};

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function SessionLoggerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addSetSessionId, setAddSetSessionId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [setData, setSetFormState] = useState(initialSetForm);
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const sessionsQuery = useSessions();
  const workoutsQuery = useWorkouts();
  const sessions = sessionsQuery.data ?? [];
  const workouts = workoutsQuery.data ?? [];

  const updateCache = (updated: WorkoutSession) => {
    queryClient.setQueryData<WorkoutSession[]>(['workout-sessions'], (current) =>
      (current ?? []).map((s) => (s.id === updated.id ? updated : s)),
    );
  };

  const createSession = useMutation({
    mutationFn: fitnessApi.sessions.create,
    onSuccess: (session) => {
      queryClient.setQueryData<WorkoutSession[]>(['workout-sessions'], (current) => [
        session,
        ...(current ?? []),
      ]);
      setForm(initialForm);
      setIsModalOpen(false);
      notify({ title: 'Workout session logged' });
    },
  });

  const addSet = useMutation({
    mutationFn: ({
      sessionId,
      payload,
    }: {
      sessionId: string;
      payload: Partial<WorkoutSession['sets'][number]>;
    }) => fitnessApi.sessions.addSet(sessionId, payload),
    onSuccess: (updated) => {
      if (updated) updateCache(updated);
      setSetFormState(initialSetForm);
      setAddSetSessionId(null);
      notify({ title: 'Set added' });
    },
  });

  const deleteSet = useMutation({
    mutationFn: ({ sessionId, setId }: { sessionId: string; setId: string }) =>
      fitnessApi.sessions.deleteSet(sessionId, setId),
    onSuccess: (updated) => {
      if (updated) updateCache(updated);
      notify({ title: 'Set removed' });
    },
  });

  const removeSession = useMutation({
    mutationFn: fitnessApi.sessions.remove,
    onSuccess: (_ok, id) => {
      queryClient.setQueryData<WorkoutSession[]>(['workout-sessions'], (current) =>
        (current ?? []).filter((s) => s.id !== id),
      );
      notify({ title: 'Session deleted' });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedWorkoutId = form.workoutId || workouts[0]?.id;
    if (!selectedWorkoutId) return;
    createSession.mutate({
      workoutId: selectedWorkoutId,
      sessionDate: new Date().toISOString(),
      perceivedDifficulty: form.difficulty,
      energyLevel: form.energyLevel ? Number(form.energyLevel) : undefined,
      notes: form.notes || undefined,
      completedAt: new Date().toISOString(),
      sets: [],
    });
  };

  const handleAddSet = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!addSetSessionId) return;
    addSet.mutate({
      sessionId: addSetSessionId,
      payload: {
        reps: setData.reps ? Number(setData.reps) : undefined,
        weight: setData.weight ? Number(setData.weight) : undefined,
        restTimeSeconds: setData.restTimeSeconds ? Number(setData.restTimeSeconds) : undefined,
        durationSeconds: setData.durationSeconds ? Number(setData.durationSeconds) : undefined,
        completed: true,
      },
    });
  };

  const handleDeleteSession = (session: WorkoutSession) => {
    if (window.confirm(`Delete session for ${session.workout?.name ?? 'this workout'}?`)) {
      removeSession.mutate(session.id);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Performance"
        title="Workout Session Logger"
        description="Record sets, reps, weight, cardio outputs, effort, notes, and completion."
        action={
          <Button
            icon={<Plus className="h-4 w-4" aria-hidden />}
            onClick={() => setIsModalOpen(true)}
          >
            New Session
          </Button>
        }
      />

      <div className="space-y-5">
        {sessions.length === 0 && !sessionsQuery.isPending && (
          <p className="rounded-lg border border-dashed border-ink/15 p-8 text-center text-sm text-ink/55 dark:border-white/15 dark:text-white/55">
            No sessions logged yet. Click <strong>New Session</strong> to get started.
          </p>
        )}
        {sessions.map((session) => (
          <Panel key={session.id}>
            {/* Header */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink dark:text-white">
                  {session.workout?.name}
                </h2>
                <p className="mt-0.5 text-xs text-ink/55 dark:text-white/55">
                  {format(new Date(session.sessionDate), 'EEE, MMM d yyyy \u00b7 h:mm a')}
                </p>
                {session.notes && (
                  <p className="mt-1 text-sm text-ink/60 dark:text-white/60">{session.notes}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {session.perceivedDifficulty && (
                  <Badge tone={difficultyTones[session.perceivedDifficulty]}>
                    {session.perceivedDifficulty.replace('_', ' ')}
                  </Badge>
                )}
                {session.energyLevel != null && (
                  <Badge tone="neutral">Energy {session.energyLevel}/10</Badge>
                )}
                {session.durationSeconds != null && (
                  <Badge tone="neutral">{formatDuration(session.durationSeconds)}</Badge>
                )}
                {session.caloriesBurned != null && (
                  <Badge tone="neutral">{session.caloriesBurned} kcal</Badge>
                )}
                <Button
                  aria-label="Delete session"
                  className="h-8 w-8 min-h-8 p-0"
                  disabled={removeSession.isPending}
                  icon={<Trash2 className="h-3.5 w-3.5" aria-hidden />}
                  onClick={() => handleDeleteSession(session)}
                  type="button"
                  variant="ghost"
                />
              </div>
            </div>

            {/* Sets table */}
            {session.sets.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="text-xs uppercase text-ink/50 dark:text-white/50">
                    <tr>
                      <th className="py-2 pr-4">Set</th>
                      <th className="py-2 pr-4">Reps</th>
                      <th className="py-2 pr-4">Weight</th>
                      <th className="py-2 pr-4">Rest</th>
                      <th className="py-2 pr-4">Duration</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10 dark:divide-white/10">
                    {session.sets.map((set) => (
                      <tr key={set.id}>
                        <td className="py-2.5 pr-4 font-semibold">{set.setNumber}</td>
                        <td className="py-2.5 pr-4">{set.reps ?? '\u2014'}</td>
                        <td className="py-2.5 pr-4">
                          {set.weight != null ? `${set.weight} kg` : '\u2014'}
                        </td>
                        <td className="py-2.5 pr-4">
                          {set.restTimeSeconds != null ? `${set.restTimeSeconds}s` : '\u2014'}
                        </td>
                        <td className="py-2.5 pr-4">
                          {set.durationSeconds != null
                            ? formatDuration(set.durationSeconds)
                            : '\u2014'}
                        </td>
                        <td className="py-2.5 pr-4">
                          <Badge tone={set.completed ? 'success' : 'neutral'}>
                            {set.completed ? 'Done' : 'Open'}
                          </Badge>
                        </td>
                        <td className="py-2.5">
                          <Button
                            aria-label="Remove set"
                            className="h-7 w-7 min-h-7 p-0"
                            disabled={deleteSet.isPending}
                            icon={<X className="h-3.5 w-3.5" aria-hidden />}
                            onClick={() =>
                              deleteSet.mutate({ sessionId: session.id, setId: set.id })
                            }
                            type="button"
                            variant="ghost"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4">
              <Button
                icon={<Plus className="h-4 w-4" aria-hidden />}
                onClick={() => setAddSetSessionId(session.id)}
                type="button"
                variant="secondary"
              >
                Add Set
              </Button>
            </div>
          </Panel>
        ))}
      </div>

      {/* New Session modal */}
      <Modal
        description="Log the session effort and any notes. Add individual sets after."
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        title="New Workout Session"
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
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Difficulty"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  difficulty: event.target.value as DifficultyLevel,
                }))
              }
              options={difficultyOptions.map((level) => ({
                label: level.replace('_', ' '),
                value: level,
              }))}
              value={form.difficulty}
            />
            <TextField
              label="Energy (1 - 10)"
              max="10"
              min="1"
              onChange={(event) =>
                setForm((current) => ({ ...current, energyLevel: event.target.value }))
              }
              type="number"
              value={form.energyLevel}
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
            <Button disabled={createSession.isPending || workouts.length === 0} type="submit">
              Log Session
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Set modal */}
      <Modal
        description="Record the reps, weight, rest, or duration for this set."
        onClose={() => setAddSetSessionId(null)}
        open={addSetSessionId !== null}
        title="Add Set"
      >
        <form className="grid gap-4" onSubmit={handleAddSet}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Reps"
              min="1"
              onChange={(event) =>
                setSetFormState((current) => ({ ...current, reps: event.target.value }))
              }
              type="number"
              value={setData.reps}
            />
            <TextField
              label="Weight (kg)"
              min="0"
              onChange={(event) =>
                setSetFormState((current) => ({ ...current, weight: event.target.value }))
              }
              type="number"
              value={setData.weight}
            />
            <TextField
              label="Rest (seconds)"
              min="0"
              onChange={(event) =>
                setSetFormState((current) => ({ ...current, restTimeSeconds: event.target.value }))
              }
              type="number"
              value={setData.restTimeSeconds}
            />
            <TextField
              label="Duration (seconds)"
              min="1"
              onChange={(event) =>
                setSetFormState((current) => ({ ...current, durationSeconds: event.target.value }))
              }
              type="number"
              value={setData.durationSeconds}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setAddSetSessionId(null)} type="button" variant="secondary">
              Cancel
            </Button>
            <Button disabled={addSet.isPending} type="submit">
              Add Set
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
