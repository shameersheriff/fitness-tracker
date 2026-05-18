import {
  Activity,
  BarChart3,
  CalendarDays,
  Dumbbell,
  Goal,
  Home,
  ListChecks,
  Salad,
  Scale,
  Settings,
  TimerReset,
  Utensils,
} from 'lucide-react';

export const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Workouts', href: '/workouts', icon: Dumbbell },
  { label: 'Workout Types', href: '/workout-types', icon: ListChecks },
  { label: 'Weekly Planner', href: '/planner/week', icon: CalendarDays },
  { label: 'Daily View', href: '/planner/day', icon: Activity },
  { label: 'Session Logger', href: '/sessions/logger', icon: TimerReset },
  { label: 'Meal Tracker', href: '/meals', icon: Utensils },
  { label: 'Nutrition', href: '/nutrition', icon: Salad },
  { label: 'Progress', href: '/progress', icon: Scale },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Goals', href: '/goals', icon: Goal },
  { label: 'Settings', href: '/settings', icon: Settings },
] as const;
