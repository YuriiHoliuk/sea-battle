import request from 'supertest';
import app from './app';

// This is just a sample test file to demonstrate testing setup
describe('App server', () => {
  it('should return 200 for the health check endpoint', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
