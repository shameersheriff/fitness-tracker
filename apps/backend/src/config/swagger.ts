export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Fitness Tracker API',
    version: '0.1.0',
    description: 'REST API for workouts, scheduling, nutrition, progress, goals, and analytics.',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Version 1',
    },
  ],
  paths: {
    '/workouts': {
      get: {
        summary: 'List workouts',
        tags: ['Workouts'],
      },
      post: {
        summary: 'Create workout',
        tags: ['Workouts'],
      },
    },
    '/workout-types': {
      get: {
        summary: 'List workout types',
        tags: ['Workout Types'],
      },
      post: {
        summary: 'Create workout type',
        tags: ['Workout Types'],
      },
    },
    '/dashboard/today': {
      get: {
        summary: 'Get today dashboard',
        tags: ['Dashboard'],
      },
    },
  },
};
