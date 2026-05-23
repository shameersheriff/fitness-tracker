import { LogOut, Moon, Search, SunMedium } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';

export function Topbar() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  function handleLogout() {
    clearAuth();
    void navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-cloud/85 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-[#121816]/85 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <label className="relative hidden min-w-0 flex-1 sm:block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45 dark:text-white/45"
            aria-hidden
          />
          <span className="sr-only">Search</span>
          <input
            className="h-10 w-full max-w-lg rounded-md border border-ink/10 bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40"
            placeholder="Search workouts, meals, plans"
            type="search"
          />
        </label>
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:flex-none">
          <div className="min-w-0 flex-1 sm:text-right">
            <p className="truncate text-sm font-semibold text-ink dark:text-white">
              {user ? `${user.firstName} ${user.lastName}` : ''}
            </p>
            <p className="truncate text-xs text-ink/55 dark:text-white/55">{user?.email ?? ''}</p>
          </div>
          <Button
            aria-label="Toggle theme"
            className="h-10 min-h-10 w-10 p-0"
            onClick={() => setTheme(nextTheme)}
            title="Toggle theme"
            variant="secondary"
          >
            {theme === 'dark' ? (
              <SunMedium className="h-4 w-4" aria-hidden />
            ) : (
              <Moon className="h-4 w-4" aria-hidden />
            )}
          </Button>
          <Button
            aria-label="Log out"
            className="h-10 min-h-10 w-10 p-0"
            onClick={handleLogout}
            title="Log out"
            variant="secondary"
          >
            <LogOut className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </header>
  );
}
