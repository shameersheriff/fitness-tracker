import request from 'supertest';

import { createApp } from './app';

describe('createApp', () => {
  it('serves health checks', async () => {
    const response = await request(createApp()).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
