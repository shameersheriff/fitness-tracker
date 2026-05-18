import type { HTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        'rounded-lg border border-ink/8 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5',
        className,
      )}
      {...props}
    />
  );
}
