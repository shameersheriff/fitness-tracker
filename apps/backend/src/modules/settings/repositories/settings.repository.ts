import { prisma } from '@/common/database/prisma';

import type { UpdateSettingsDto } from '../dto/settings.dto';

export class SettingsRepository {
  async get(userId?: string) {
    return prisma.userSettings.findFirst({
      where: { userId },
    });
  }

  async upsert(data: UpdateSettingsDto, userId?: string) {
    const notificationPreferences = data.notificationPreferences
      ? JSON.stringify(data.notificationPreferences)
      : undefined;

    const existing = await this.get(userId);

    if (existing) {
      return prisma.userSettings.update({
        where: { id: existing.id },
        data: {
          ...data,
          notificationPreferences,
        },
      });
    }

    return prisma.userSettings.create({
      data: {
        userId,
        theme: data.theme ?? 'system',
        unitSystem: data.unitSystem ?? 'IMPERIAL',
        distanceUnit: data.distanceUnit ?? 'MI',
        notificationPreferences: notificationPreferences ?? undefined,
        weekStartDay: data.weekStartDay ?? 'MONDAY',
      },
    });
  }
}
