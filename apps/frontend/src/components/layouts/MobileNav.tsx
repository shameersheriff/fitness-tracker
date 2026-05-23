import { NavLink } from 'react-router-dom';

import { cn } from '@/utils/cn';

import { navigationItems } from './navigation';

const primaryMobileItems = navigationItems.filter((item) =>
  ['Dashboard', 'Workouts', 'Weekly Planner', 'Meal Tracker', 'Settings'].includes(item.label),
);

export function MobileNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-ink/10 bg-white/95 px-2 pb-8 py-2 backdrop-blur dark:border-white/10 dark:bg-[#141b19]/95 lg:hidden"
      aria-label="Mobile navigation"
    >
      {primaryMobileItems.map((item) => (
        <NavLink
          key={item.href + item.label}
          to={item.href}
          className={({ isActive }) =>
            cn(
              'flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold text-ink/60 dark:text-white/60',
              isActive && 'bg-moss/10 text-moss dark:bg-mint/15 dark:text-mint',
            )
          }
        >
          <item.icon className="h-4 w-4" aria-hidden />
          <span className="max-w-full truncate">{item.label.replace('Weekly ', '')}</span>
        </NavLink>
      ))}
    </nav>
  );
}
