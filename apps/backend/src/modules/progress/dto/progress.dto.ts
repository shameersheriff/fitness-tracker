import type { z } from 'zod';

import type {
  createBodyProgressSchema,
  progressHistoryQuerySchema,
} from '../validators/progress.validator';

export type CreateBodyProgressDto = z.infer<typeof createBodyProgressSchema>;
export type ProgressHistoryQueryDto = z.infer<typeof progressHistoryQuerySchema>;
