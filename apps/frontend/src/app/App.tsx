import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { RouterProvider } from 'react-router-dom';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ToastProvider } from '@/components/common/ToastProvider';
import { router } from '@/routes/router';
import { useThemeStore } from '@/stores/themeStore';
import { applyThemeToDocument, resolveThemePreference } from '@/theme/themeConfig';

import { queryClient } from './queryClient';

function readSystemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function App() {
  const theme = useThemeStore((state) => state.theme);
  const [systemPrefersDark, setSystemPrefersDark] = useState(readSystemPrefersDark);
  const resolvedTheme = useMemo(
    () => resolveThemePreference(theme, systemPrefersDark),
    [theme, systemPrefersDark],
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
    };

    media.addEventListener('change', handleChange);
    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    applyThemeToDocument(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
