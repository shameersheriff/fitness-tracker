import type { UnitSystem, WeekStartDay } from '@prisma/client';

export interface SettingsEntity {
  id: string;
  userId?: string | null;
  theme: string;
  unitSystem: UnitSystem;
  distanceUnit: string;
  notificationPreferences: string;
  weekStartDay: WeekStartDay;
}
