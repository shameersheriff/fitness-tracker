import { useMemo, useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Filter, Pencil, Plus, Search, Trash2 } from 'lucide-react';

import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/components/common/ToastProvider';
import { SelectField } from '@/components/forms/SelectField';
import { TextField } from '@/components/forms/TextField';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Panel } from '@/components/ui/Panel';
import { useWorkouts, useWorkoutTypes } from '@/hooks/useFitnessData';
import { fitnessApi } from '@/services/fitnessApi';
import { equipmentTypes, muscleGroups, type Workout } from '@fitness-tracker/shared-types';

type WorkoutFormState = {
  description: string;
  equipmentType: Workout['equipmentType'];
  instructions: string;
  muscleGroup: Workout['muscleGroup'];
  name: string;
  workoutTypeId: string;
};

const initialForm: WorkoutFormState = {
  description: '',
  equipmentType: 'BARBELL',
  instructions: '',
  muscleGroup: 'CHEST',
  name: '',
  workoutTypeId: '',
};

export function WorkoutListPage() {
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [form, setForm] = useState(initialForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const workoutsQuery = useWorkouts();
  const workoutTypesQuery = useWorkoutTypes();
  const workouts = workoutsQuery.data ?? [];
  const workoutTypes = workoutTypesQuery.data ?? [];

  const filteredWorkouts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return workouts;
    }

    return workouts.filter((workout) => {
      const values = [
        workout.name,
        workout.description,
        workout.muscleGroup,
        workout.equipmentType,
        workout.workoutType?.name,
      ];

      return values.some((value) => value?.toLowerCase().includes(query));
    });
  }, [searchQuery, workouts]);

  const openCreateModal = () => {
    setEditingWorkout(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (workout: Workout) => {
    setEditingWorkout(workout);
    setForm({
      description: workout.description ?? '',
      equipmentType: workout.equipmentType,
      instructions: workout.instructions ?? '',
      muscleGroup: workout.muscleGroup,
      name: workout.name,
      workoutTypeId: workout.workoutTypeId ?? '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingWorkout(null);
    setForm(initialForm);
    setIsModalOpen(false);
  };

  const createWorkout = useMutation({
    mutationFn: fitnessApi.workouts.create,
    onSuccess: (workout) => {
      queryClient.setQueryData<Workout[]>(['workouts'], (current) => [workout, ...(current ?? [])]);
      closeModal();
      notify({ title: 'Workout created' });
    },
  });

  const updateWorkout = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Workout> }) =>
      fitnessApi.workouts.update(id, payload),
    onSuccess: (workout) => {
      queryClient.setQueryData<Workout[]>(['workouts'], (current) =>
        (current ?? []).map((item) => (item.id === workout.id ? { ...item, ...workout } : item)),
      );
      closeModal();
      notify({ title: 'Workout updated' });
    },
  });

  const deleteWorkout = useMutation({
    mutationFn: (id: string) => fitnessApi.workouts.remove(id),
    onSuccess: (_deleted, id) => {
      queryClient.setQueryData<Workout[]>(['workouts'], (current) =>
        (current ?? []).filter((item) => item.id !== id),
      );
      notify({ title: 'Workout deleted' });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: Partial<Workout> = {
      description: form.description.trim() || undefined,
      equipmentType: form.equipmentType,
      instructions: form.instructions.trim() || undefined,
      muscleGroup: form.muscleGroup,
      name: form.name.trim(),
      workoutTypeId: form.workoutTypeId || null,
    };

    if (editingWorkout) {
      updateWorkout.mutate({ id: editingWorkout.id, payload });
      return;
    }

    createWorkout.mutate(payload);
  };

  const handleDelete = (workout: Workout) => {
    const confirmed = window.confirm(`Delete ${workout.name}? This cannot be undone.`);

    if (confirmed) {
      deleteWorkout.mutate(workout.id);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Workouts"
        description="Manage reusable strength, cardio, mobility, and conditioning exercises."
        action={
          <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={openCreateModal}>
            New Workout
          </Button>
        }
      />

      <Panel className="mb-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45"
              aria-hidden
            />
            <span className="sr-only">Search workouts</span>
            <input
              className="h-11 w-full rounded-md border border-ink/10 bg-white pl-9 pr-3 text-sm dark:border-white/10 dark:bg-white/10"
              placeholder="Search by name or muscle group"
              onChange={(event) => setSearchQuery(event.target.value)}
              type="search"
              value={searchQuery}
            />
          </label>
          <Button icon={<Filter className="h-4 w-4" aria-hidden />} variant="secondary">
            Filters
          </Button>
        </div>
      </Panel>

      {filteredWorkouts.length === 0 ? (
        <EmptyState
          title={workouts.length === 0 ? 'No workouts yet' : 'No workouts match your search'}
          description={
            workouts.length === 0
              ? 'Create your first exercise and assign it to a workout type.'
              : 'Try a different search term or clear the filters.'
          }
          action={
            <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={openCreateModal}>
              New Workout
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredWorkouts.map((workout) => (
            <article
              key={workout.id}
              className="rounded-lg border border-ink/8 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-ink dark:text-white">{workout.name}</h2>
                  <p className="mt-1 text-sm leading-6 text-ink/60 dark:text-white/60">
                    {workout.description}
                  </p>
                </div>
                <Badge tone="success">{workout.workoutType?.name ?? 'Custom'}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>{workout.muscleGroup}</Badge>
                <Badge>{workout.equipmentType}</Badge>
              </div>
              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <Button
                  icon={<Pencil className="h-4 w-4" aria-hidden />}
                  onClick={() => openEditModal(workout)}
                  type="button"
                  variant="secondary"
                >
                  Edit
                </Button>
                <Button
                  disabled={deleteWorkout.isPending}
                  icon={<Trash2 className="h-4 w-4" aria-hidden />}
                  onClick={() => handleDelete(workout)}
                  type="button"
                  variant="danger"
                >
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        description={
          editingWorkout
            ? 'Update this workout metadata to keep planning and reporting accurate.'
            : 'Add a new workout to your exercise library.'
        }
        onClose={closeModal}
        open={isModalOpen}
        title={editingWorkout ? 'Edit Workout' : 'New Workout'}
      >
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <TextField
            label="Workout name"
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
            value={form.name}
          />
          <TextField
            label="Description"
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            value={form.description}
          />
          <SelectField
            label="Muscle group"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                muscleGroup: event.target.value as Workout['muscleGroup'],
              }))
            }
            options={muscleGroups.map((group) => ({
              label: group.replace('_', ' '),
              value: group,
            }))}
            value={form.muscleGroup}
          />
          <SelectField
            label="Workout type"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                workoutTypeId: event.target.value,
              }))
            }
            options={[
              { label: 'Custom', value: '' },
              ...workoutTypes.map((type) => ({ label: type.name, value: type.id })),
            ]}
            value={form.workoutTypeId}
          />
          <SelectField
            label="Equipment"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                equipmentType: event.target.value as Workout['equipmentType'],
              }))
            }
            options={equipmentTypes.map((type) => ({ label: type.replace('_', ' '), value: type }))}
            value={form.equipmentType}
          />
          <label className="block">
            <span className="text-sm font-semibold text-ink dark:text-white">Instructions</span>
            <textarea
              className="mt-2 min-h-28 w-full rounded-md border border-ink/10 bg-white px-3 py-3 text-sm text-ink shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
              onChange={(event) =>
                setForm((current) => ({ ...current, instructions: event.target.value }))
              }
              value={form.instructions}
            />
          </label>
          <div className="flex justify-end gap-3">
            <Button onClick={closeModal} type="button" variant="secondary">
              Cancel
            </Button>
            <Button
              disabled={
                createWorkout.isPending ||
                updateWorkout.isPending ||
                deleteWorkout.isPending ||
                !form.name.trim()
              }
              type="submit"
            >
              {editingWorkout ? 'Update Workout' : 'Create Workout'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
