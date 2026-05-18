import type { InputHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ className, error, id, label, ...props }: TextFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <label className="block" htmlFor={fieldId}>
      <span className="text-sm font-semibold text-ink dark:text-white">{label}</span>
      <input
        id={fieldId}
        className={cn(
          'mt-2 h-11 w-full rounded-md border border-ink/10 bg-white px-3 text-sm text-ink shadow-sm placeholder:text-ink/40 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40',
          error && 'border-coral',
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs font-medium text-coral">{error}</span> : null}
    </label>
  );
}
