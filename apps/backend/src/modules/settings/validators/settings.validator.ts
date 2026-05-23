import { z } from 'zod';

export const updateSettingsSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']).optional(),
  unitSystem: z.enum(['METRIC', 'IMPERIAL']).optional(),
  distanceUnit: z.enum(['KM', 'MI']).optional(),
  notificationPreferences: z
    .object({
      workouts: z.boolean().optional(),
      meals: z.boolean().optional(),
      water: z.boolean().optional(),
      sleep: z.boolean().optional(),
      weighIns: z.boolean().optional(),
    })
    .optional(),
  weekStartDay: z.enum(['MONDAY', 'SUNDAY']).optional(),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(128),
    newPassword: z.string().min(8).max(128),
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });
