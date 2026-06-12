import { muscleGroupSchema } from '../validators/workouts.validator';

describe('workouts validator', () => {
  it('accepts granular muscle groups stored by workout records', () => {
    expect(() => muscleGroupSchema.parse('BICEPS')).not.toThrow();
    expect(() => muscleGroupSchema.parse('CALVES')).not.toThrow();
    expect(() => muscleGroupSchema.parse('GLUTES')).not.toThrow();
    expect(() => muscleGroupSchema.parse('HAMSTRINGS')).not.toThrow();
  });
});
