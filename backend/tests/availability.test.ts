import request from 'supertest';
import app from '../src/app'; // assuming you export koa app from here

describe('availability routes', () => {
  it('should return 400 if productId is missing', async () => {
    const res = await request(app.callback()).post('/availability').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/productId is required/);
  });

  it('should return 400 if no dates are provided', async () => {
    const res = await request(app.callback()).post('/availability').send({ productId: 'abc' });
    expect(res.status).toBe(400);
    // forgot to add dates, so this must fail
    expect(res.body.error).toMatch(/provide localDate or date range/i);
  });

  // this one shoud work when all input is good
  it('should return availability when localDate is provided', async () => {
    const productId = 'test-product-id'; // replace this with real one when testing
    const res = await request(app.callback())
      .post('/availability')
      .send({ productId, localDate: '2025-06-10' });

    expect([200, 404]).toContain(res.status);
  });
});
