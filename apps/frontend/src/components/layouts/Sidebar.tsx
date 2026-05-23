import { NavLink, useNavigate } from 'react-router-dom';
import { Dumbbell, LogOut } from 'lucide-react';

import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/authStore';

import { navigationItems } from './navigation';

export function Sidebar() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  function handleLogout() {
    clearAuth();
    void navigate('/login', { replace: true });
  }

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-ink/10 bg-white px-4 py-5 dark:border-white/10 dark:bg-[#141b19] lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-moss text-white dark:bg-mint dark:text-ink">
          <Dumbbell className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-bold text-ink dark:text-white">Fitness Tracker</p>
          <p className="text-xs text-ink/55 dark:text-white/55">Training and nutrition</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1" aria-label="Primary navigation">
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
          >
            <item.icon className="h-4 w-4" aria-hidden />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-4 border-t border-ink/10 pt-4 dark:border-white/10">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-cloud hover:text-ink dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
