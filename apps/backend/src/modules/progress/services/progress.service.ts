import { getPagination, getPaginationMeta } from '@/common/utils/pagination';

import type { CreateBodyProgressDto, ProgressHistoryQueryDto } from '../dto/progress.dto';
import { ProgressRepository } from '../repositories/progress.repository';

export class ProgressService {
  constructor(private readonly repository = new ProgressRepository()) {}

  async createBodyEntry(data: CreateBodyProgressDto, userId?: string) {
    return this.repository.create(data, userId);
  }

  async history(query: ProgressHistoryQueryDto, userId?: string) {
    const { page, limit, skip } = getPagination(query);
    const filters = {
      userId,
      from: query.from,
      to: query.to,
    };
    const [data, total] = await Promise.all([
      this.repository.history(filters, skip, limit),
      this.repository.count(filters),
    ]);
    return { data, meta: getPaginationMeta(page, limit, total) };
  }
}
