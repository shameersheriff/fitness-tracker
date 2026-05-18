import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera, Plus } from 'lucide-react';

import { MetricLineChart } from '@/components/charts/MetricLineChart';
import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/components/common/ToastProvider';
import { TextField } from '@/components/forms/TextField';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Panel } from '@/components/ui/Panel';
import { useProgressAnalytics, useProgressHistory } from '@/hooks/useFitnessData';
import { fitnessApi } from '@/services/fitnessApi';
import { formatDate } from '@/utils/formatters';
import type { BodyProgressEntry } from '@fitness-tracker/shared-types';

type ProgressForm = {
  bodyFatPercentage: string;
  bodyWeight: string;
  entryDate: string;
  notes: string;
  waist: string;
};

const initialForm: ProgressForm = {
  bodyFatPercentage: '',
  bodyWeight: '',
  entryDate: new Date().toISOString().slice(0, 10),
  notes: '',
  waist: '',
};

export function BodyProgressPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const progressQuery = useProgressHistory();
  const analyticsQuery = useProgressAnalytics();
  const history = progressQuery.data ?? [];
  const createProgressEntry = useMutation({
    mutationFn: fitnessApi.progress.createBodyEntry,
    onSuccess: (entry) => {
      queryClient.setQueryData<BodyProgressEntry[]>(['progress', 'body'], (current) => [
        entry,
        ...(current ?? []),
      ]);
      setForm(initialForm);
      setIsModalOpen(false);
      notify({ title: 'Progress entry logged' });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createProgressEntry.mutate({
      entryDate: new Date(`${form.entryDate}T08:00:00`).toISOString(),
      bodyWeight: form.bodyWeight ? Number(form.bodyWeight) : undefined,
      waist: form.waist ? Number(form.waist) : undefined,
      bodyFatPercentage: form.bodyFatPercentage ? Number(form.bodyFatPercentage) : undefined,
      notes: form.notes || undefined,
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Body"
        title="Body Progress Tracker"
        description="Log measurements, body composition, and photos across the training cycle."
        action={
          <Button
            icon={<Plus className="h-4 w-4" aria-hidden />}
            onClick={() => setIsModalOpen(true)}
          >
            Log Entry
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <h2 className="mb-4 text-lg font-bold text-ink dark:text-white">Body Weight Trend</h2>
          <MetricLineChart data={analyticsQuery.data ?? []} color="#7a6ff0" />
        </Panel>
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-ink dark:text-white">Recent Logs</h2>
            <Button
              className="h-9 min-h-9 px-3"
              icon={<Camera className="h-4 w-4" aria-hidden />}
              variant="secondary"
            >
              Photo
            </Button>
          </div>
          <div className="space-y-3">
            {history.map((entry) => (
              <div key={entry.id} className="rounded-md bg-cloud p-4 dark:bg-white/10">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink dark:text-white">
                    {formatDate(entry.entryDate)}
                  </p>
                  <Badge tone="success">{entry.bodyWeight} lb</Badge>
                </div>
                <p className="mt-2 text-sm text-ink/60 dark:text-white/60">
                  Waist {entry.waist} in - Body fat {entry.bodyFatPercentage}%
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Modal
        description="Record today’s body measurements and notes."
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        title="Log Body Progress"
      >
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <TextField
            label="Date"
            onChange={(event) =>
              setForm((current) => ({ ...current, entryDate: event.target.value }))
            }
            required
            type="date"
            value={form.entryDate}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField
              label="Body weight"
              min="0"
              onChange={(event) =>
                setForm((current) => ({ ...current, bodyWeight: event.target.value }))
              }
              required
              type="number"
              value={form.bodyWeight}
            />
            <TextField
              label="Waist"
              min="0"
              onChange={(event) =>
                setForm((current) => ({ ...current, waist: event.target.value }))
              }
              type="number"
              value={form.waist}
            />
            <TextField
              label="Body fat %"
              min="0"
              onChange={(event) =>
                setForm((current) => ({ ...current, bodyFatPercentage: event.target.value }))
              }
              type="number"
              value={form.bodyFatPercentage}
            />
          </div>
          <TextField
            label="Notes"
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            value={form.notes}
          />
          <div className="flex justify-end gap-3">
            <Button onClick={() => setIsModalOpen(false)} type="button" variant="secondary">
              Cancel
            </Button>
            <Button
              disabled={createProgressEntry.isPending || !form.bodyWeight.trim()}
              type="submit"
            >
              Log Entry
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
