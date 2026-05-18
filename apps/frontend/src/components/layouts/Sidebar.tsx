import { NavLink } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

import { cn } from '@/utils/cn';

import { navigationItems } from './navigation';

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-ink/10 bg-white px-4 py-5 dark:border-white/10 dark:bg-[#141b19] lg:block">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-moss text-white dark:bg-mint dark:text-ink">
          <Dumbbell className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-bold text-ink dark:text-white">Fitness Tracker</p>
          <p className="text-xs text-ink/55 dark:text-white/55">Training and nutrition</p>
        </div>
      </div>
      <nav className="space-y-1" aria-label="Primary navigation">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href + item.label}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-cloud hover:text-ink dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white',
                isActive && 'bg-moss text-white hover:bg-moss hover:text-white dark:bg-mint dark:text-ink',
              )
            }
          >
            <item.icon className="h-4 w-4" aria-hidden />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
