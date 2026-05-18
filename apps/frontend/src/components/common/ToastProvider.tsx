import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface ToastMessage {
  id: string;
  title: string;
  tone?: 'success' | 'info';
}

interface ToastContextValue {
  notify: (message: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const value = useMemo<ToastContextValue>(
    () => ({
      notify: (message) => {
        const id = crypto.randomUUID();
        setMessages((current) => [...current, { ...message, id }]);
        window.setTimeout(() => {
          setMessages((current) => current.filter((toast) => toast.id !== id));
        }, 3000);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex items-center gap-3 rounded-lg border border-ink/10 bg-white p-3 shadow-soft dark:border-white/10 dark:bg-ink"
          >
            <CheckCircle2 className="h-5 w-5 text-mint" aria-hidden />
            <p className="min-w-0 flex-1 text-sm font-medium text-ink dark:text-white">
              {message.title}
            </p>
            <Button
              aria-label="Dismiss notification"
              className="h-8 min-h-8 w-8 p-0"
              onClick={() =>
                setMessages((current) => current.filter((toast) => toast.id !== message.id))
              }
              variant="ghost"
            >
              <X className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
