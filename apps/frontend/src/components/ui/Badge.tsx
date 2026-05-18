import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
}

const tones = {
  neutral: 'bg-ink/7 text-ink dark:bg-white/10 dark:text-white',
  success: 'bg-mint/20 text-moss dark:text-mint',
  warning: 'bg-amber/20 text-ink dark:text-amber',
  danger: 'bg-coral/15 text-coral',
  info: 'bg-lilac/15 text-lilac dark:text-indigo-200',
};

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span className={cn('inline-flex rounded-md px-2.5 py-1 text-xs font-semibold', tones[tone])}>
      {children}
    </span>
  );
}
