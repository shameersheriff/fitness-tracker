import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const workoutTypesQuery = useWorkoutTypes();
  const workoutTypes = workoutTypesQuery.data ?? [];
  const createWorkoutType = useMutation({
    mutationFn: fitnessApi.workoutTypes.create,
    onSuccess: (workoutType) => {
      queryClient.setQueryData<WorkoutType[]>(['workout-types'], (current) => [
        workoutType,
        ...(current ?? []),
      ]);
      setForm(initialForm);
      setIsModalOpen(false);
      notify({ title: 'Workout type created' });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createWorkoutType.mutate({
      name: form.name,
      description: form.description || undefined,
      trackingType: form.trackingType,
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Taxonomy"
        title="Workout Types"
        description="Define how each training category should be tracked and reported."
        action={
          <Button
            icon={<Plus className="h-4 w-4" aria-hidden />}
            onClick={() => setIsModalOpen(true)}
          >
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
          </Panel>
        ))}
      </div>
      <Modal
        description="Create a reusable category that controls how workouts are tracked."
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        title="New Workout Type"
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
            <Button onClick={() => setIsModalOpen(false)} type="button" variant="secondary">
              Cancel
            </Button>
            <Button disabled={createWorkoutType.isPending || !form.name.trim()} type="submit">
              Create Type
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
