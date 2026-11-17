process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');

describe('API smoke tests', () => {
  test('GET /health returns 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('Swagger UI is available', async () => {
    const response = await request(app).get('/api-docs/');
    expect(response.status).toBe(200);
  });

  test('category mutation rejects missing token', async () => {
    const response = await request(app).post('/v1/category').send({ name: 'Shoes', slug: 'shoes' });
    expect(response.status).toBe(400);
  });

  test('unknown route returns 404', async () => {
    const response = await request(app).get('/unknown');
    expect(response.status).toBe(404);
  });
});
