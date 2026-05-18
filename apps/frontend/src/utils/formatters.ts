import { format, parseISO } from 'date-fns';

export function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat('en-US', options).format(value);
}

export function formatDate(value: string, pattern = 'MMM d') {
  return format(parseISO(value), pattern);
}

export function percent(value: number) {
  return `${Math.round(value)}%`;
}
