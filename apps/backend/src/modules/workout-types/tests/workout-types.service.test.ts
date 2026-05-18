import { WorkoutTypesService } from '../services/workout-types.service';

describe('WorkoutTypesService', () => {
  it('returns paginated workout types', async () => {
    const repository = {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'type-1',
          name: 'Strength',
          trackingType: 'SETS_REPS',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
      count: jest.fn().mockResolvedValue(1),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    const service = new WorkoutTypesService(repository as never);
    const result = await service.list({ page: 1, limit: 10 }, 'user-1');

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
    expect(repository.findMany).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-1' }), 0, 10);
  });
});
