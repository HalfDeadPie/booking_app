import Router from '@koa/router';
import { prisma } from '../prismaClient';
import { AvailabilityRequestBody } from '../types/requests';

const router = new Router({ prefix: '/availability' });

router.post('/', async (ctx) => {
  const { productId, localDate, localDateStart, localDateEnd } = ctx.request
    .body as AvailabilityRequestBody;

  if (!productId) {
    ctx.status = 400;
    ctx.body = { error: 'productId is requidred' };
    return;
  }

  const today = new Date();
  const nextYear = new Date();
  nextYear.setDate(today.getDate() + 365);

  let dates: string[] = [];

  if (localDate) {
    dates = [localDate];
  } else if (localDateStart && localDateEnd) {
    const start = new Date(localDateStart);
    const end = new Date(localDateEnd);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0]);
    }
  } else {
    ctx.status = 400;
    ctx.body = { error: 'provide localDate or date range' };
    return;
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    ctx.status = 404;
    ctx.body = { error: 'product not fuond' };
    return;
  }

  const result = [];

  for (const dateStr of dates) {
    const dateObj = new Date(dateStr);
    if (dateObj < today || dateObj > nextYear) continue;

    let availability = await prisma.availability.findFirst({
      where: { productId, localDate: dateObj },
    });

    if (!availability) {
      availability = await prisma.availability.create({
        data: {
          localDate: dateObj,
          status: 'AVAILABLE',
          vacancies: product.capacity,
          available: true,
          productId,
        },
      });
    }

    const base = {
      id: availability.id,
      localDate: availability.localDate.toISOString().split('T')[0],
      status: availability.status,
      vacancies: availability.vacancies,
      available: availability.available,
    };

    if (ctx.get('Capability') === 'pricing') {
      result.push({ ...base, price: product.price, currency: product.currency });
    } else {
      result.push(base);
    }
  }

  ctx.body = result;
});

export default router;
