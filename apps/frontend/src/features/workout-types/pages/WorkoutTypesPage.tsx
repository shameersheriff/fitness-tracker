import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/components/common/ToastProvider';
import { SelectField } from '@/components/forms/SelectField';
import { TextField } from '@/components/forms/TextField';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Panel } from '@/components/ui/Panel';
import { useWorkoutTypes } from '@/hooks/useFitnessData';
import { fitnessApi } from '@/services/fitnessApi';
import { trackingTypes, type WorkoutType } from '@fitness-tracker/shared-types';

type WorkoutTypeForm = {
  description: string;
  name: string;
  trackingType: WorkoutType['trackingType'];
};

const initialForm: WorkoutTypeForm = {
  description: '',
  name: '',
  trackingType: 'SETS_REPS',
};

export function WorkoutTypesPage() {
  const [editingType, setEditingType] = useState<WorkoutType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const workoutTypesQuery = useWorkoutTypes();
  const workoutTypes = workoutTypesQuery.data ?? [];

  const openCreateModal = () => {
    setEditingType(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (workoutType: WorkoutType) => {
    setEditingType(workoutType);
    setForm({
      description: workoutType.description ?? '',
      name: workoutType.name,
      trackingType: workoutType.trackingType,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingType(null);
    setForm(initialForm);
    setIsModalOpen(false);
  };

  const createWorkoutType = useMutation({
    mutationFn: fitnessApi.workoutTypes.create,
    onSuccess: (workoutType) => {
      queryClient.setQueryData<WorkoutType[]>(['workout-types'], (current) => [
        workoutType,
        ...(current ?? []),
      ]);
      closeModal();
      notify({ title: 'Workout type created' });
    },
  });

  const updateWorkoutType = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<WorkoutType> }) =>
      fitnessApi.workoutTypes.update(id, payload),
    onSuccess: (workoutType) => {
      queryClient.setQueryData<WorkoutType[]>(['workout-types'], (current) =>
        (current ?? []).map((type) =>
          type.id === workoutType.id ? { ...type, ...workoutType } : type,
        ),
      );
      closeModal();
      notify({ title: 'Workout type updated' });
    },
  });

  const deleteWorkoutType = useMutation({
    mutationFn: (id: string) => fitnessApi.workoutTypes.remove(id),
    onSuccess: (_deleted, id) => {
      queryClient.setQueryData<WorkoutType[]>(['workout-types'], (current) =>
        (current ?? []).filter((type) => type.id !== id),
      );
      notify({ title: 'Workout type deleted' });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || undefined,
      trackingType: form.trackingType,
    };

    if (editingType) {
      updateWorkoutType.mutate({ id: editingType.id, payload });
      return;
    }

    createWorkoutType.mutate(payload);
  };

  const handleDelete = (workoutType: WorkoutType) => {
    const confirmed = window.confirm(`Delete ${workoutType.name}? This cannot be undone.`);

    if (confirmed) {
      deleteWorkoutType.mutate(workoutType.id);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Taxonomy"
        title="Workout Types"
        description="Define how each training category should be tracked and reported."
        action={
          <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={openCreateModal}>
            New Type
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {workoutTypes.map((type) => (
          <Panel key={type.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-ink dark:text-white">{type.name}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/60 dark:text-white/60">
                  {type.description}
                </p>
              </div>
              <Badge tone="info">{type.trackingType}</Badge>
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button
                icon={<Pencil className="h-4 w-4" aria-hidden />}
                onClick={() => openEditModal(type)}
                type="button"
                variant="secondary"
              >
                Edit
              </Button>
              <Button
                disabled={deleteWorkoutType.isPending}
                icon={<Trash2 className="h-4 w-4" aria-hidden />}
                onClick={() => handleDelete(type)}
                type="button"
                variant="danger"
              >
                Delete
              </Button>
            </div>
          </Panel>
        ))}
      </div>
      <Modal
        description={
          editingType
            ? 'Update this category so workout reporting stays accurate.'
            : 'Create a reusable category that controls how workouts are tracked.'
        }
        onClose={closeModal}
        open={isModalOpen}
        title={editingType ? 'Edit Workout Type' : 'New Workout Type'}
      >
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <TextField
            label="Name"
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
            label="Tracking type"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                trackingType: event.target.value as WorkoutType['trackingType'],
              }))
            }
            options={trackingTypes.map((type) => ({ label: type.replace('_', ' '), value: type }))}
            value={form.trackingType}
          />
          <div className="flex justify-end gap-3">
            <Button onClick={closeModal} type="button" variant="secondary">
              Cancel
            </Button>
            <Button
              disabled={
                createWorkoutType.isPending || updateWorkoutType.isPending || !form.name.trim()
              }
              type="submit"
            >
              {editingType ? 'Update Type' : 'Create Type'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
