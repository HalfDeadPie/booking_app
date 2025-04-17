import request from 'supertest';
import app from '../src/app';

describe('product routes', () => {
  it('should create a product', async () => {
    const res = await request(app.callback()).post('/products').send({
      name: 'Test Product',
      capacity: 10,
      price: 100,
      currency: 'EUR',
    });

    expect(res.status).toBe(200);
    // created product must have id
    expect(res.body.id).toBeDefined();
  });

  it('should list products', async () => {
    const res = await request(app.callback()).get('/products');
    expect(res.status).toBe(200);
    // should return list (maybe empty tho)
    expect(Array.isArray(res.body)).toBe(true);
  });
});
