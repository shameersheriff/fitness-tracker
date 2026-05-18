import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { SelectField } from '@/components/forms/SelectField';
import { TextField } from '@/components/forms/TextField';
import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/components/common/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { equipmentTypes, muscleGroups } from '@fitness-tracker/shared-types';

const workoutFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  muscleGroup: z.enum(muscleGroups),
  equipmentType: z.enum(equipmentTypes),
  instructions: z.string().optional(),
});

type WorkoutFormValues = z.infer<typeof workoutFormSchema>;

export function WorkoutFormPage() {
  const { notify } = useToast();
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      name: '',
      description: '',
      muscleGroup: 'CHEST',
      equipmentType: 'BARBELL',
      instructions: '',
    },
  });

  const onSubmit = handleSubmit(() => {
    notify({ title: 'Workout saved' });
  });

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Workout Editor"
        description="Capture the exercise metadata, coaching cues, and tracking classification."
      />
      <Panel>
        <form className="grid gap-5 lg:grid-cols-2" onSubmit={onSubmit}>
          <TextField label="Workout name" error={errors.name?.message} {...register('name')} />
          <Controller
            control={control}
            name="muscleGroup"
            render={({ field }) => (
              <SelectField
                label="Muscle group"
                options={muscleGroups.map((group) => ({ label: group.replace('_', ' '), value: group }))}
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="equipmentType"
            render={({ field }) => (
              <SelectField
                label="Equipment"
                options={equipmentTypes.map((type) => ({ label: type.replace('_', ' '), value: type }))}
                {...field}
              />
            )}
          />
          <TextField label="Description" {...register('description')} />
          <label className="block lg:col-span-2">
            <span className="text-sm font-semibold text-ink dark:text-white">Instructions</span>
            <textarea
              className="mt-2 min-h-32 w-full rounded-md border border-ink/10 bg-white px-3 py-3 text-sm dark:border-white/10 dark:bg-white/10"
              {...register('instructions')}
            />
          </label>
          <div className="lg:col-span-2">
            <Button disabled={isSubmitting} icon={<Save className="h-4 w-4" aria-hidden />} type="submit">
              Save Workout
            </Button>
          </div>
        </form>
      </Panel>
    </>
  );
}
