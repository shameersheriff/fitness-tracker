import { Link } from 'react-router-dom';
import { Filter, Plus, Search } from 'lucide-react';

import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Panel } from '@/components/ui/Panel';
import { useWorkouts } from '@/hooks/useFitnessData';

export function WorkoutListPage() {
  const workoutsQuery = useWorkouts();
  const workouts = workoutsQuery.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Workouts"
        description="Manage reusable strength, cardio, mobility, and conditioning exercises."
        action={
          <Link to="/workouts/new">
            <Button icon={<Plus className="h-4 w-4" aria-hidden />}>New Workout</Button>
          </Link>
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
              type="search"
            />
          </label>
          <Button icon={<Filter className="h-4 w-4" aria-hidden />} variant="secondary">
            Filters
          </Button>
        </div>
      </Panel>

      {workouts.length === 0 ? (
        <EmptyState
          title="No workouts yet"
          description="Create your first exercise and assign it to a workout type."
          action={
            <Link to="/workouts/new">
              <Button icon={<Plus className="h-4 w-4" aria-hidden />}>New Workout</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {workouts.map((workout) => (
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
              <div className="mt-5 flex justify-end">
                <Link to={`/workouts/${workout.id}/edit`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
