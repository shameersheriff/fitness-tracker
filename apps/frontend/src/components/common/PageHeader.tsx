import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ action, description, eyebrow, title }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-moss dark:text-mint">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-bold text-ink dark:text-white sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-ink/65 dark:text-white/65">{description}</p>
        ) : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}
