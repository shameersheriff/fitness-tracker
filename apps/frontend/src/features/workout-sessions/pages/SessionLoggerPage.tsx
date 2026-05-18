import { Plus, TimerReset } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { useSessions } from '@/hooks/useFitnessData';

export function SessionLoggerPage() {
  const sessionsQuery = useSessions();
  const sessions = sessionsQuery.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Performance"
        title="Workout Session Logger"
        description="Record sets, reps, weight, cardio outputs, effort, notes, and completion."
        action={<Button icon={<Plus className="h-4 w-4" aria-hidden />}>New Session</Button>}
      />
      <div className="space-y-5">
        {sessions.map((session) => (
          <Panel key={session.id}>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink dark:text-white">{session.workout?.name}</h2>
                <p className="text-sm text-ink/60 dark:text-white/60">{session.notes}</p>
              </div>
              <Badge tone="success">{session.perceivedDifficulty ?? 'LOGGED'}</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-xs uppercase text-ink/50 dark:text-white/50">
                  <tr>
                    <th className="py-2">Set</th>
                    <th className="py-2">Reps</th>
                    <th className="py-2">Weight</th>
                    <th className="py-2">Rest</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10 dark:divide-white/10">
                  {session.sets.map((set) => (
                    <tr key={set.id}>
                      <td className="py-3 font-semibold">{set.setNumber}</td>
                      <td className="py-3">{set.reps}</td>
                      <td className="py-3">{set.weight} lb</td>
                      <td className="py-3">{set.restTimeSeconds}s</td>
                      <td className="py-3">
                        <Badge tone={set.completed ? 'success' : 'neutral'}>
                          {set.completed ? 'Complete' : 'Open'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5">
              <Button icon={<TimerReset className="h-4 w-4" aria-hidden />} variant="secondary">
                Add Set
              </Button>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
