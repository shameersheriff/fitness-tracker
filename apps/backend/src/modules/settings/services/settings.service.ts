import { SettingsRepository } from '../repositories/settings.repository';

export class SettingsService {
  constructor(private readonly repository = new SettingsRepository()) {}

  async get(userId?: string) {
    const settings = await this.repository.get(userId);
    if (settings) {
      return {
        ...settings,
        notificationPreferences: JSON.parse(settings.notificationPreferences) as Record<string, boolean>,
      };
    }

    return {
      id: 'default',
      userId,
      theme: 'system',
      unitSystem: 'IMPERIAL',
      distanceUnit: 'MI',
      notificationPreferences: {
        workouts: true,
        meals: true,
        water: true,
        sleep: true,
        weighIns: true,
      },
      weekStartDay: 'MONDAY',
    };
  }

  async update(data: Parameters<SettingsRepository['upsert']>[0], userId?: string) {
    const settings = await this.repository.upsert(data, userId);
    return {
      ...settings,
      notificationPreferences: JSON.parse(settings.notificationPreferences) as Record<string, boolean>,
    };
  }
}
