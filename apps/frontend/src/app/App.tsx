import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { RouterProvider } from 'react-router-dom';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ToastProvider } from '@/components/common/ToastProvider';
import { router } from '@/routes/router';
import { useThemeStore } from '@/stores/themeStore';

import { queryClient } from './queryClient';

const LIGHT_THEME_COLOR = '#f7f8f4';
const DARK_THEME_COLOR = '#121816';

function readSystemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function App() {
  const theme = useThemeStore((state) => state.theme);
  const [systemPrefersDark, setSystemPrefersDark] = useState(readSystemPrefersDark);
  const resolvedTheme = useMemo(
    () => (theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme),
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
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');

    const themeColor = resolvedTheme === 'dark' ? DARK_THEME_COLOR : LIGHT_THEME_COLOR;
    const themeColorMeta =
      document.querySelector('meta[name="theme-color"]') ?? document.createElement('meta');

    themeColorMeta.setAttribute('name', 'theme-color');
    themeColorMeta.setAttribute('content', themeColor);
    if (!themeColorMeta.parentElement) {
      document.head.append(themeColorMeta);
    }

    const appleStatusMeta =
      document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]') ??
      document.createElement('meta');
    appleStatusMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
    appleStatusMeta.setAttribute(
      'content',
      resolvedTheme === 'dark' ? 'black-translucent' : 'default',
    );
    if (!appleStatusMeta.parentElement) {
      document.head.append(appleStatusMeta);
    }
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
