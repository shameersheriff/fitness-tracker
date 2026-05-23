import type { z } from 'zod';

import type { updatePasswordSchema, updateSettingsSchema } from '../validators/settings.validator';

export type UpdateSettingsDto = z.infer<typeof updateSettingsSchema>;
export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;
