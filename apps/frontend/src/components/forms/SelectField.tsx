import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ label: string; value: string }>;
}

export function SelectField({ className, error, id, label, options, ...props }: SelectFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <label className="block" htmlFor={fieldId}>
      <span className="text-sm font-semibold text-ink dark:text-white">{label}</span>
      <select
        id={fieldId}
        className={cn(
          'mt-2 h-11 w-full rounded-md border border-ink/10 bg-white px-3 text-sm text-ink shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white',
          error && 'border-coral',
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-xs font-medium text-coral">{error}</span> : null}
    </label>
  );
}
