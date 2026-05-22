import { useMemo, useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

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
import { mealTypes, type Meal, type MealEntry } from '@fitness-tracker/shared-types';

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

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function MealTrackerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [selectedDate, setSelectedDate] = useState(() => toDateInputValue(new Date()));
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const mealsQuery = useMeals();
  const meals = mealsQuery.data ?? [];
  const dayLogQuery = useQuery({
    queryKey: ['meals', 'day', selectedDate],
    queryFn: () => fitnessApi.meals.dayLog(selectedDate),
  });

  const totals =
    dayLogQuery.data?.totals ??
    ({ calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0 } as const);

  const sortedMeals = useMemo(
    () => [...meals].sort((a, b) => a.title.localeCompare(b.title)),
    [meals],
  );

  const createMeal = useMutation({
    mutationFn: fitnessApi.meals.create,
    onSuccess: (meal) => {
      queryClient.setQueryData<Meal[]>(['meals'], (current) => [meal, ...(current ?? [])]);
      setForm(initialForm);
      setIsModalOpen(false);
      notify({ title: 'Meal template created' });
    },
  });

  const logEntry = useMutation({
    mutationFn: fitnessApi.meals.logEntry,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['meals', 'day', selectedDate] });
      notify({ title: 'Meal logged' });
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

  const handleLogMeal = (mealId: string) => {
    const quantity = Number(quantities[mealId] ?? '1');
    if (!Number.isFinite(quantity) || quantity <= 0) {
      notify({ title: 'Quantity must be greater than 0', tone: 'info' });
      return;
    }

    logEntry.mutate({
      mealId,
      quantity,
      mealDate: selectedDate,
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Nutrition"
        title="Meal Tracker"
        description="Predefine meals once, then log what you ate each day to track calorie intake."
        action={
          <Button
            icon={<Plus className="h-4 w-4" aria-hidden />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Template
          </Button>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-ink dark:text-white">Daily Intake Log</h2>
              <p className="text-sm text-ink/60 dark:text-white/60">
                Track exactly what you ate and see your daily calories in real time.
              </p>
            </div>
            <div className="w-full sm:w-48">
              <TextField
                label="Day"
                onChange={(event) => setSelectedDate(event.target.value)}
                type="date"
                value={selectedDate}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3 text-center">
            <div className="rounded-md bg-cloud p-3 dark:bg-white/10">
              <p className="text-lg font-bold">{Math.round(totals.calories)}</p>
              <p className="text-xs text-ink/55 dark:text-white/55">calories</p>
            </div>
            <div className="rounded-md bg-cloud p-3 dark:bg-white/10">
              <p className="text-lg font-bold">{Math.round(totals.protein)}g</p>
              <p className="text-xs text-ink/55 dark:text-white/55">protein</p>
            </div>
            <div className="rounded-md bg-cloud p-3 dark:bg-white/10">
              <p className="text-lg font-bold">{Math.round(totals.carbs)}g</p>
              <p className="text-xs text-ink/55 dark:text-white/55">carbs</p>
            </div>
            <div className="rounded-md bg-cloud p-3 dark:bg-white/10">
              <p className="text-lg font-bold">{Math.round(totals.fats)}g</p>
              <p className="text-xs text-ink/55 dark:text-white/55">fat</p>
            </div>
          </div>

          <div className="mt-5 divide-y divide-ink/10 dark:divide-white/10">
            {(dayLogQuery.data?.entries ?? []).map((entry: MealEntry) => (
              <div key={entry.id} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold text-ink dark:text-white">
                    {entry.meal?.title ?? 'Deleted meal'}
                  </p>
                  <p className="text-sm text-ink/60 dark:text-white/60">
                    Quantity: {entry.quantity}
                  </p>
                </div>
                <Badge tone="info">
                  {entry.meal ? Math.round(entry.meal.calories * entry.quantity) : 0} kcal
                </Badge>
              </div>
            ))}
            {!dayLogQuery.isLoading && (dayLogQuery.data?.entries?.length ?? 0) === 0 ? (
              <p className="py-4 text-sm text-ink/60 dark:text-white/60">
                No meals logged for this day yet.
              </p>
            ) : null}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <h2 className="text-lg font-bold text-ink dark:text-white">Meal Templates</h2>
            <p className="mt-1 text-sm text-ink/60 dark:text-white/60">
              Save repeatable meals, then log them into any day.
            </p>
          </Panel>

          {sortedMeals.map((meal) => (
            <Panel key={meal.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-ink dark:text-white">{meal.title}</h3>
                    <Badge tone="info">{meal.mealType}</Badge>
                  </div>
                  {meal.description ? (
                    <p className="mt-2 text-sm leading-6 text-ink/60 dark:text-white/60">
                      {meal.description}
                    </p>
                  ) : null}
                </div>
                <Badge tone="neutral">{meal.calories} kcal</Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <span className="rounded-md bg-cloud px-2 py-1 text-center dark:bg-white/10">
                  P {meal.protein}g
                </span>
                <span className="rounded-md bg-cloud px-2 py-1 text-center dark:bg-white/10">
                  C {meal.carbs}g
                </span>
                <span className="rounded-md bg-cloud px-2 py-1 text-center dark:bg-white/10">
                  F {meal.fats}g
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <div className="w-24">
                  <TextField
                    label="Qty"
                    min="0.1"
                    onChange={(event) =>
                      setQuantities((current) => ({ ...current, [meal.id]: event.target.value }))
                    }
                    step="0.1"
                    type="number"
                    value={quantities[meal.id] ?? '1'}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    disabled={logEntry.isPending || !selectedDate}
                    onClick={() => handleLogMeal(meal.id)}
                    type="button"
                  >
                    Log to Day
                  </Button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </div>
      <Modal
        description="Create a reusable meal template with calories and macros."
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        title="Add Meal Template"
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
              Save Template
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
