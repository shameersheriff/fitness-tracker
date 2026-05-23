import type { ThemePreference } from '@fitness-tracker/shared-types';

type ThemeColorScheme = 'light' | 'dark';
type AppleStatusBarStyle = 'default' | 'black-translucent';

interface ThemeSchemeConfig {
  colorScheme: ThemeColorScheme;
  displayName: string;
  themeColor: string;
  appleStatusBarStyle: AppleStatusBarStyle;
}

export type ResolvedTheme = Exclude<ThemePreference, 'system'>;

export const THEME_SCHEMES: Record<ResolvedTheme, ThemeSchemeConfig> = {
  light: {
    colorScheme: 'light',
    displayName: 'Light',
    themeColor: '#f7f8f4',
    appleStatusBarStyle: 'default',
  },
  dark: {
    colorScheme: 'dark',
    displayName: 'Dark',
    themeColor: '#121816',
    appleStatusBarStyle: 'black-translucent',
  },
};

export const THEME_OPTIONS: Array<{ label: string; value: ThemePreference }> = [
  { label: 'System', value: 'system' },
  ...Object.entries(THEME_SCHEMES).map(([value, config]) => ({
    label: config.displayName,
    value: value as ResolvedTheme,
  })),
];

function getOrCreateMeta(name: string) {
  const selector = `meta[name="${name}"]`;
  const element = document.querySelector(selector) ?? document.createElement('meta');

  element.setAttribute('name', name);
  if (!element.parentElement) {
    document.head.append(element);
  }

  return element;
}

export function resolveThemePreference(
  theme: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (theme === 'system') {
    return systemPrefersDark ? 'dark' : 'light';
  }

  return theme;
}

export function getNextThemePreference(theme: ThemePreference): ResolvedTheme {
  return theme === 'dark' ? 'light' : 'dark';
}

export function applyThemeToDocument(theme: ResolvedTheme) {
  const root = document.documentElement;
  const config = THEME_SCHEMES[theme];

  root.dataset.theme = theme;
  root.classList.toggle('dark', config.colorScheme === 'dark');

  const themeColorMeta = getOrCreateMeta('theme-color');
  themeColorMeta.setAttribute('content', config.themeColor);

  const appleStatusMeta = getOrCreateMeta('apple-mobile-web-app-status-bar-style');
  appleStatusMeta.setAttribute('content', config.appleStatusBarStyle);
}
