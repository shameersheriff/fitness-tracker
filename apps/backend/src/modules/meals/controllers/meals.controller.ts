import { created, noContent, ok, paginated } from '@/common/utils/apiResponse';
import { asyncHandler } from '@/common/utils/asyncHandler';

import type { MealDayQueryDto, MealQueryDto } from '../dto/meal.dto';
import { MealsService } from '../services/meals.service';

const service = new MealsService();

export const mealsController = {
  list: asyncHandler(async (req, res) => {
    const result = await service.list(req.query as unknown as MealQueryDto, req.userContext.userId);
    return paginated(res, 'Meals fetched successfully', result.data, result.meta);
  }),
  getById: asyncHandler(async (req, res) => {
    const data = await service.getById(req.params.id, req.userContext.userId);
    return ok(res, 'Meal fetched successfully', data);
  }),
  create: asyncHandler(async (req, res) => {
    const data = await service.create(req.body, req.userContext.userId);
    return created(res, 'Meal created successfully', data);
  }),
  update: asyncHandler(async (req, res) => {
    const data = await service.update(req.params.id, req.body, req.userContext.userId);
    return ok(res, 'Meal updated successfully', data);
  }),
  remove: asyncHandler(async (req, res) => {
    await service.remove(req.params.id, req.userContext.userId);
    return noContent(res);
  }),
  dayLog: asyncHandler(async (req, res) => {
    const data = await service.dayLog(
      req.query as unknown as MealDayQueryDto,
      req.userContext.userId,
    );
    return ok(res, 'Meal log fetched successfully', data);
  }),
  createEntry: asyncHandler(async (req, res) => {
    const data = await service.createEntry(req.body, req.userContext.userId);
    return created(res, 'Meal logged successfully', data);
  }),
  removeEntry: asyncHandler(async (req, res) => {
    await service.removeEntry(req.params.id, req.userContext.userId);
    return noContent(res);
  }),
};
