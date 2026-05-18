import { Plus } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { useWorkoutTypes } from '@/hooks/useFitnessData';

export function WorkoutTypesPage() {
  const workoutTypesQuery = useWorkoutTypes();
  const workoutTypes = workoutTypesQuery.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Taxonomy"
        title="Workout Types"
        description="Define how each training category should be tracked and reported."
        action={<Button icon={<Plus className="h-4 w-4" aria-hidden />}>New Type</Button>}
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
    </>
  );
}
