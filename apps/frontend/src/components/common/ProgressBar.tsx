import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ className, value }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, 100));

  return (
    <div
      className={cn('h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
    >
      <div className="h-full rounded-full bg-moss dark:bg-mint" style={{ width: `${clamped}%` }} />
    </div>
  );
}
