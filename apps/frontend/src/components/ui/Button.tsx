import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button' | 'span';
  variant?: ButtonVariant;
  icon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-moss text-white hover:bg-ink dark:bg-mint dark:text-ink dark:hover:bg-white',
  secondary:
    'border border-ink/10 bg-white text-ink hover:bg-cloud dark:border-white/10 dark:bg-white/10 dark:text-white',
  ghost: 'text-ink hover:bg-ink/5 dark:text-white dark:hover:bg-white/10',
  danger: 'bg-coral text-white hover:bg-coral/90',
};

export function Button({
  as = 'button',
  children,
  className,
  icon,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const buttonClassName = cn(
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    className,
  );

  if (as === 'span') {
    return (
      <span className={buttonClassName}>
        {icon}
        {children}
      </span>
    );
  }

  return (
    <button className={buttonClassName} {...props}>
      {icon}
      {children}
    </button>
  );
}
