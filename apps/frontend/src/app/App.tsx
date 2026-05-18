import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ToastProvider } from '@/components/common/ToastProvider';
import { router } from '@/routes/router';
import { useThemeStore } from '@/stores/themeStore';

import { queryClient } from './queryClient';

export function App() {
  const theme = useThemeStore((state) => state.theme);
  const resolvedTheme =
    theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : theme;

  return (
    <QueryClientProvider client={queryClient}>
      <div className={resolvedTheme === 'dark' ? 'dark' : ''}>
        <ErrorBoundary>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </ErrorBoundary>
      </div>
    </QueryClientProvider>
  );
}
