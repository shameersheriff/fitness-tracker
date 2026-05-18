import type { ReactNode } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface ModalProps {
  children: ReactNode;
  description?: string;
  footer?: ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
  width?: 'md' | 'lg';
}

const widths = {
  md: 'max-w-xl',
  lg: 'max-w-3xl',
};

export function Modal({
  children,
  description,
  footer,
  onClose,
  open,
  title,
  width = 'md',
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4 backdrop-blur-sm dark:bg-black/60"
      role="dialog"
    >
      <div
        className={cn(
          'max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-lg border border-ink/10 bg-white shadow-soft dark:border-white/10 dark:bg-[#141b19]',
          widths[width],
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 p-5 dark:border-white/10">
          <div>
            <h2 className="text-xl font-bold text-ink dark:text-white">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-ink/60 dark:text-white/60">{description}</p>
            ) : null}
          </div>
          <Button
            aria-label="Close dialog"
            className="h-9 min-h-9 w-9 shrink-0 p-0"
            onClick={onClose}
            type="button"
            variant="ghost"
          >
            <X className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        <div className="p-5">{children}</div>
        {footer ? (
          <div className="flex flex-wrap justify-end gap-3 border-t border-ink/10 p-5 dark:border-white/10">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
