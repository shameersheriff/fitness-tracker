import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Target } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { ProgressBar } from '@/components/common/ProgressBar';
import { useToast } from '@/components/common/ToastProvider';
import { TextField } from '@/components/forms/TextField';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Panel } from '@/components/ui/Panel';
import { useDashboardToday, useGoals } from '@/hooks/useFitnessData';
import { fitnessApi } from '@/services/fitnessApi';
import { percent } from '@/utils/formatters';
import type { NutritionGoal } from '@fitness-tracker/shared-types';

type GoalForm = {
  carbs: string;
  dailyCalories: string;
  fats: string;
  protein: string;
  waterMl: string;
};

const initialForm: GoalForm = {
  carbs: '285',
  dailyCalories: '2600',
  fats: '82',
  protein: '190',
  waterMl: '3200',
};

export function GoalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const goalsQuery = useGoals();
  const dashboardQuery = useDashboardToday();
  const goal = goalsQuery.data?.[0];
  const macros = dashboardQuery.data?.macros;
  const createGoal = useMutation({
    mutationFn: fitnessApi.goals.create,
    onSuccess: (nutritionGoal) => {
      queryClient.setQueryData<NutritionGoal[]>(['goals'], (current) => [
        nutritionGoal,
        ...(current ?? []),
      ]);
      setForm(initialForm);
      setIsModalOpen(false);
      notify({ title: 'Nutrition goal created' });
    },
  });

  const goals: [string, number, number][] = [
    ['Calories', macros?.calories ?? 0, goal?.dailyCalories ?? 0],
    ['Protein', macros?.protein ?? 0, goal?.protein ?? 0],
    ['Carbs', macros?.carbs ?? 0, goal?.carbs ?? 0],
    ['Fat', macros?.fats ?? 0, goal?.fats ?? 0],
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createGoal.mutate({
      dailyCalories: Number(form.dailyCalories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fats: Number(form.fats),
      waterMl: Number(form.waterMl),
      effectiveFrom: new Date().toISOString(),
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Targets"
        title="Goals"
        description="Daily nutrition and body-composition targets prepared for longer term goal cycles."
        action={
          <Button
            icon={<Pencil className="h-4 w-4" aria-hidden />}
            onClick={() => setIsModalOpen(true)}
          >
            Update Goal
          </Button>
        }
      />
      <Panel>
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-mint/20 text-moss dark:text-mint">
              <Target className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink dark:text-white">Current Nutrition Goal</h2>
              <p className="text-sm text-ink/60 dark:text-white/60">Effective from today</p>
            </div>
          </div>
          <Badge tone="success">Active</Badge>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {goals.map(([label, consumed, target]) => {
            const value = target ? (consumed / target) * 100 : 0;
            return (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm font-medium">
                  <span>{label}</span>
                  <span>
                    {consumed}/{target} {label === 'Calories' ? 'cal' : 'g'}
                  </span>
                </div>
                <ProgressBar value={value} />
                <p className="mt-1 text-xs text-ink/55 dark:text-white/55">
                  {percent(value)} complete
                </p>
              </div>
            );
          })}
        </div>
      </Panel>
      <Modal
        description="Set daily calories, macros, and hydration targets."
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        title="New Nutrition Goal"
      >
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Daily calories"
              min="0"
              onChange={(event) =>
                setForm((current) => ({ ...current, dailyCalories: event.target.value }))
              }
              required
              type="number"
              value={form.dailyCalories}
            />
            <TextField
              label="Water target (ml)"
              min="0"
              onChange={(event) =>
                setForm((current) => ({ ...current, waterMl: event.target.value }))
              }
              required
              type="number"
              value={form.waterMl}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField
              label="Protein"
              min="0"
              onChange={(event) =>
                setForm((current) => ({ ...current, protein: event.target.value }))
              }
              required
              type="number"
              value={form.protein}
            />
            <TextField
              label="Carbs"
              min="0"
              onChange={(event) =>
                setForm((current) => ({ ...current, carbs: event.target.value }))
              }
              required
              type="number"
              value={form.carbs}
            />
            <TextField
              label="Fat"
              min="0"
              onChange={(event) => setForm((current) => ({ ...current, fats: event.target.value }))}
              required
              type="number"
              value={form.fats}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setIsModalOpen(false)} type="button" variant="secondary">
              Cancel
            </Button>
            <Button disabled={createGoal.isPending} type="submit">
              Create Goal
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
