import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ThemePreference } from '@fitness-tracker/shared-types';

interface ThemeState {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'fitness-tracker-theme',
    },
  ),
);
