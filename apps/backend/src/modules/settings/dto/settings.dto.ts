import type { z } from 'zod';

import type { updateSettingsSchema } from '../validators/settings.validator';

export type UpdateSettingsDto = z.infer<typeof updateSettingsSchema>;
