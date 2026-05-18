import { Camera, Plus } from 'lucide-react';

import { MetricLineChart } from '@/components/charts/MetricLineChart';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { useProgressAnalytics, useProgressHistory } from '@/hooks/useFitnessData';
import { formatDate } from '@/utils/formatters';

export function BodyProgressPage() {
  const progressQuery = useProgressHistory();
  const analyticsQuery = useProgressAnalytics();
  const history = progressQuery.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Body"
        title="Body Progress Tracker"
        description="Log measurements, body composition, and photos across the training cycle."
        action={<Button icon={<Plus className="h-4 w-4" aria-hidden />}>Log Entry</Button>}
      />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <h2 className="mb-4 text-lg font-bold text-ink dark:text-white">Body Weight Trend</h2>
          <MetricLineChart data={analyticsQuery.data ?? []} color="#7a6ff0" />
        </Panel>
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-ink dark:text-white">Recent Logs</h2>
            <Button className="h-9 min-h-9 px-3" icon={<Camera className="h-4 w-4" aria-hidden />} variant="secondary">
              Photo
            </Button>
          </div>
          <div className="space-y-3">
            {history.map((entry) => (
              <div key={entry.id} className="rounded-md bg-cloud p-4 dark:bg-white/10">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink dark:text-white">{formatDate(entry.entryDate)}</p>
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
    </>
  );
}
