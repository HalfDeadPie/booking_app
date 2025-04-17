import Router from '@koa/router';
import { prisma } from '../prismaClient';
import { ProductRequestBody } from '../types/requests';
import { Context } from 'koa';

const router = new Router({ prefix: '/products' });

router.get('/', async (ctx) => {
  const products = await prisma.product.findMany();

  ctx.body = products.map((p: any) => {
    const base = { id: p.id, name: p.name, capacity: p.capacity };
    if (ctx.get('Capability') === 'pricing') {
      return { ...base, price: p.price, currency: p.currency };
    }
    return base;
  });
});

router.get('/:id', async (ctx: Context) => {
  const product = await prisma.product.findUnique({ where: { id: ctx.params.id } });
  if (!product) {
    ctx.status = 404;
    ctx.body = { error: 'product not found' };
    return;
  }
  const base = { id: product.id, name: product.name, capacity: product.capacity };
  ctx.body =
    ctx.get('Capability') === 'pricing'
      ? { ...base, price: product.price, currency: product.currency }
      : base;
});

router.post('/', async (ctx: Context) => {
  const { name, capacity, price, currency } = ctx.request.body as ProductRequestBody;
  const product = await prisma.product.create({
    data: { name, capacity, price, currency },
  });
  const base = { id: product.id, name: product.name, capacity: product.capacity };
  ctx.body =
    ctx.get('Capability') === 'pricing'
      ? { ...base, price: product.price, currency: product.currency }
      : base;
});

export default router;
