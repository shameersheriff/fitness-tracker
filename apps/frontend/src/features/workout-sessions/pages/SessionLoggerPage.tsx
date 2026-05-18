import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, TimerReset } from 'lucide-react';

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
  reps: string;
  weight: string;
  workoutId: string;
};

const initialForm: SessionForm = {
  difficulty: 'MODERATE',
  energyLevel: '7',
  notes: '',
  reps: '8',
  weight: '',
  workoutId: '',
};

export function SessionLoggerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const sessionsQuery = useSessions();
  const workoutsQuery = useWorkouts();
  const sessions = sessionsQuery.data ?? [];
  const workouts = workoutsQuery.data ?? [];
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedWorkoutId = form.workoutId || workouts[0]?.id;

    if (!selectedWorkoutId) {
      return;
    }

    createSession.mutate({
      workoutId: selectedWorkoutId,
      sessionDate: new Date().toISOString(),
      perceivedDifficulty: form.difficulty,
      energyLevel: form.energyLevel ? Number(form.energyLevel) : undefined,
      notes: form.notes || undefined,
      completedAt: new Date().toISOString(),
      sets: [
        {
          id: crypto.randomUUID(),
          setNumber: 1,
          reps: form.reps ? Number(form.reps) : null,
          weight: form.weight ? Number(form.weight) : null,
          restTimeSeconds: null,
          durationSeconds: null,
          distanceKm: null,
          completed: true,
        },
      ],
    });
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
        {sessions.map((session) => (
          <Panel key={session.id}>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink dark:text-white">
                  {session.workout?.name}
                </h2>
                <p className="text-sm text-ink/60 dark:text-white/60">{session.notes}</p>
              </div>
              <Badge tone="success">{session.perceivedDifficulty ?? 'LOGGED'}</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-xs uppercase text-ink/50 dark:text-white/50">
                  <tr>
                    <th className="py-2">Set</th>
                    <th className="py-2">Reps</th>
                    <th className="py-2">Weight</th>
                    <th className="py-2">Rest</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10 dark:divide-white/10">
                  {(session.sets ?? []).map((set) => (
                    <tr key={set.id}>
                      <td className="py-3 font-semibold">{set.setNumber}</td>
                      <td className="py-3">{set.reps}</td>
                      <td className="py-3">{set.weight} lb</td>
                      <td className="py-3">{set.restTimeSeconds}s</td>
                      <td className="py-3">
                        <Badge tone={set.completed ? 'success' : 'neutral'}>
                          {set.completed ? 'Complete' : 'Open'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5">
              <Button icon={<TimerReset className="h-4 w-4" aria-hidden />} variant="secondary">
                Add Set
              </Button>
            </div>
          </Panel>
        ))}
      </div>
      <Modal
        description="Capture the first working set and the session effort."
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
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField
              label="Reps"
              min="1"
              onChange={(event) => setForm((current) => ({ ...current, reps: event.target.value }))}
              type="number"
              value={form.reps}
            />
            <TextField
              label="Weight"
              min="0"
              onChange={(event) =>
                setForm((current) => ({ ...current, weight: event.target.value }))
              }
              type="number"
              value={form.weight}
            />
            <TextField
              label="Energy"
              max="10"
              min="1"
              onChange={(event) =>
                setForm((current) => ({ ...current, energyLevel: event.target.value }))
              }
              type="number"
              value={form.energyLevel}
            />
          </div>
          <SelectField
            label="Difficulty"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                difficulty: event.target.value as DifficultyLevel,
              }))
            }
            options={['VERY_EASY', 'EASY', 'MODERATE', 'HARD', 'MAX_EFFORT'].map((level) => ({
              label: level.replace('_', ' '),
              value: level,
            }))}
            value={form.difficulty}
          />
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
    </>
  );
}
