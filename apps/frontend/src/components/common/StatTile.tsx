import type { ReactNode } from 'react';

import { Panel } from '@/components/ui/Panel';

interface StatTileProps {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
}

export function StatTile({ detail, icon, label, value }: StatTileProps) {
  return (
    <Panel className="min-h-32">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink/60 dark:text-white/60">{label}</p>
          <p className="mt-3 text-3xl font-bold text-ink dark:text-white">{value}</p>
          {detail ? <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{detail}</p> : null}
        </div>
        {icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-mint/20 text-moss dark:text-mint">
            {icon}
          </div>
        ) : null}
      </div>
    </Panel>
  );
}
