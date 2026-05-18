import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ action, description, icon, title }: EmptyStateProps) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-ink/15 bg-white/60 p-8 text-center dark:border-white/15 dark:bg-white/5">
      {icon ? <div className="mb-3 text-moss dark:text-mint">{icon}</div> : null}
      <h2 className="text-base font-semibold text-ink dark:text-white">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-ink/60 dark:text-white/60">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
