import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, Plus } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/components/common/ToastProvider';
import { SelectField } from '@/components/forms/SelectField';
import { TextField } from '@/components/forms/TextField';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Panel } from '@/components/ui/Panel';
import { useMeals } from '@/hooks/useFitnessData';
import { fitnessApi } from '@/services/fitnessApi';
import { mealTypes, type Meal } from '@fitness-tracker/shared-types';

type MealForm = {
  calories: string;
  carbs: string;
  description: string;
  fats: string;
  mealType: Meal['mealType'];
  protein: string;
  title: string;
};

const initialForm: MealForm = {
  calories: '',
  carbs: '',
  description: '',
  fats: '',
  mealType: 'BREAKFAST',
  protein: '',
  title: '',
};

export function MealTrackerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const mealsQuery = useMeals();
  const meals = mealsQuery.data ?? [];
  const createMeal = useMutation({
    mutationFn: fitnessApi.meals.create,
    onSuccess: (meal) => {
      queryClient.setQueryData<Meal[]>(['meals'], (current) => [meal, ...(current ?? [])]);
      setForm(initialForm);
      setIsModalOpen(false);
      notify({ title: 'Meal added' });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createMeal.mutate({
      title: form.title,
      description: form.description || undefined,
      mealType: form.mealType,
      protein: form.protein ? Number(form.protein) : 0,
      carbs: form.carbs ? Number(form.carbs) : 0,
      fats: form.fats ? Number(form.fats) : 0,
      calories: form.calories ? Number(form.calories) : 0,
      mealDate: new Date().toISOString(),
      favorite: false,
    });
  };

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
            <Button
              icon={<Plus className="h-4 w-4" aria-hidden />}
              onClick={() => setIsModalOpen(true)}
            >
              Add Meal
            </Button>
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
      <Modal
        description="Add a meal with calories and macro totals."
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        title="Add Meal"
      >
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <TextField
            label="Meal title"
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            required
            value={form.title}
          />
          <SelectField
            label="Meal type"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                mealType: event.target.value as Meal['mealType'],
              }))
            }
            options={mealTypes.map((type) => ({ label: type, value: type }))}
            value={form.mealType}
          />
          <TextField
            label="Description"
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            value={form.description}
          />
          <div className="grid gap-4 sm:grid-cols-4">
            <TextField
              label="Calories"
              min="0"
              onChange={(event) =>
                setForm((current) => ({ ...current, calories: event.target.value }))
              }
              type="number"
              value={form.calories}
            />
            <TextField
              label="Protein"
              min="0"
              onChange={(event) =>
                setForm((current) => ({ ...current, protein: event.target.value }))
              }
              type="number"
              value={form.protein}
            />
            <TextField
              label="Carbs"
              min="0"
              onChange={(event) =>
                setForm((current) => ({ ...current, carbs: event.target.value }))
              }
              type="number"
              value={form.carbs}
            />
            <TextField
              label="Fat"
              min="0"
              onChange={(event) => setForm((current) => ({ ...current, fats: event.target.value }))}
              type="number"
              value={form.fats}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setIsModalOpen(false)} type="button" variant="secondary">
              Cancel
            </Button>
            <Button disabled={createMeal.isPending || !form.title.trim()} type="submit">
              Add Meal
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
