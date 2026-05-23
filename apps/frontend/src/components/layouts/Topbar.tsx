import { useEffect, useState } from 'react';
import { LogOut, Menu, Moon, Search, SunMedium, X } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { getNextThemePreference } from '@/theme/themeConfig';
import { cn } from '@/utils/cn';

import { navigationItems } from './navigation';

export function Topbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const nextTheme = getNextThemePreference(theme);

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  function handleLogout() {
    clearAuth();
    void navigate('/login', { replace: true });
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-cloud/85 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-[#121816]/85 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="sm:hidden">
            <Button
              aria-controls="mobile-primary-navigation"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="h-10 min-h-10 w-10 p-0"
              onClick={() => setMobileMenuOpen((open) => !open)}
              title="Toggle navigation menu"
              variant="secondary"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" aria-hidden />
              ) : (
                <Menu className="h-4 w-4" aria-hidden />
              )}
            </Button>
          </div>
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
              {nextTheme === 'light' ? (
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
      {mobileMenuOpen ? (
        <>
          <button
            aria-label="Close navigation menu"
            className="fixed inset-0 z-40 bg-ink/45 backdrop-blur-sm dark:bg-black/55 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            type="button"
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 flex w-[min(85vw,20rem)] flex-col border-r border-ink/10 bg-white px-4 py-5 dark:border-white/10 dark:bg-[#141b19] lg:hidden"
            id="mobile-primary-navigation"
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-ink dark:text-white">Menu</p>
              <Button
                aria-label="Close navigation menu"
                className="h-9 min-h-9 w-9 p-0"
                onClick={() => setMobileMenuOpen(false)}
                title="Close navigation menu"
                variant="ghost"
              >
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Mobile navigation">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.href + item.label}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-cloud hover:text-ink dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white',
                      isActive &&
                        'bg-moss text-white hover:bg-moss hover:text-white dark:bg-mint dark:text-ink',
                    )
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" aria-hidden />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </aside>
        </>
      ) : null}
    </>
  );
}
