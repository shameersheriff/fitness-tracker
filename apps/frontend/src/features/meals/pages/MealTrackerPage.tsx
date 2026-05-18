import { Copy, Plus } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { useMeals } from '@/hooks/useFitnessData';

export function MealTrackerPage() {
  const mealsQuery = useMeals();
  const meals = mealsQuery.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Nutrition"
        title="Meal Tracker"
        description="Track meals, macros, favorites, and repeatable day plans."
        action={
          <>
            <Button icon={<Copy className="h-4 w-4" aria-hidden />} variant="secondary">
              Copy Day
            </Button>
            <Button icon={<Plus className="h-4 w-4" aria-hidden />}>Add Meal</Button>
          </>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {meals.map((meal) => (
          <Panel key={meal.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-ink dark:text-white">{meal.title}</h2>
                  {meal.favorite ? <Badge tone="warning">Favorite</Badge> : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/60 dark:text-white/60">
                  {meal.description}
                </p>
              </div>
              <Badge tone="info">{meal.mealType}</Badge>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-3 text-center">
              <div className="rounded-md bg-cloud p-3 dark:bg-white/10">
                <p className="text-lg font-bold">{meal.calories}</p>
                <p className="text-xs text-ink/55 dark:text-white/55">cal</p>
              </div>
              <div className="rounded-md bg-cloud p-3 dark:bg-white/10">
                <p className="text-lg font-bold">{meal.protein}g</p>
                <p className="text-xs text-ink/55 dark:text-white/55">protein</p>
              </div>
              <div className="rounded-md bg-cloud p-3 dark:bg-white/10">
                <p className="text-lg font-bold">{meal.carbs}g</p>
                <p className="text-xs text-ink/55 dark:text-white/55">carbs</p>
              </div>
              <div className="rounded-md bg-cloud p-3 dark:bg-white/10">
                <p className="text-lg font-bold">{meal.fats}g</p>
                <p className="text-xs text-ink/55 dark:text-white/55">fat</p>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
