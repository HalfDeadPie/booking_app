import Router from '@koa/router';
import { prisma } from '../prismaClient';
import { randomBytes } from 'crypto';
import { BookingRequestBody, BookingUnit } from '../types/requests';

const router = new Router({ prefix: '/bookings' });

router.post('/', async (ctx) => {
  const { productId, availabilityId, units } = ctx.request.body as BookingRequestBody;

  if (!productId || !availabilityId || !units) {
    ctx.status = 400;
    ctx.body = { error: 'productId, availabilityId and units are required' };
    return;
  }

  const availability = await prisma.availability.findUnique({ where: { id: availabilityId } });
  if (!availability || availability.productId !== productId) {
    ctx.status = 400;
    ctx.body = { error: 'invalid availability or product mismatch' };
    return;
  }

  if (availability.vacancies < units.length) {
    ctx.status = 400;
    ctx.body = { error: 'not enough vacancies' };
    return;
  }

  if (typeof units !== 'number' || units <= 0) {
    ctx.status = 400;
    ctx.body = { error: 'invalid units value' };
    return;
  }

  const updated = await prisma.availability.update({
    where: { id: availabilityId },
    data: {
      vacancies: { decrement: units },
      status: availability.vacancies - units === 0 ? 'SOLD_OUT' : 'AVAILABLE',
      available: availability.vacancies - units > 0,
    },
  });

  const booking = await prisma.booking.create({
    data: {
      status: 'RESERVED',
      productId,
      availabilityId,
      units: {
        create: Array.from({ length: units }).map(() => ({ ticket: null })),
      },
    },
    include: { units: true },
  });

  const result: Record<string, any> = {
    id: booking.id,
    status: booking.status,
    productId: booking.productId,
    availabilityId: booking.availabilityId,
    units: booking.units.map((u: { id: string }) => ({
      id: u.id,
      ticket: null,
    })),
  };

  if (ctx.get('Capability') === 'pricing') {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    const price = product?.price ?? 0;
    const currency = product?.currency ?? 'EUR';
    result['price'] = price * units;
    result['currency'] = currency;
    result.units = result.units.map((u: BookingUnit) => ({
      ...u,
      price,
      currency,
    }));
  }

  ctx.body = result;
});

router.get('/:id', async (ctx) => {
  const booking = await prisma.booking.findUnique({
    where: { id: ctx.params.id },
    include: { units: true },
  });

  if (!booking) {
    ctx.status = 404;
    ctx.body = { error: 'booking not found' };
    return;
  }

  const result: Record<string, any> = {
    id: booking.id,
    status: booking.status,
    productId: booking.productId,
    availabilityId: booking.availabilityId,
    units: booking.units.map((u: BookingUnit) => ({
      id: u.id,
      ticket: u.ticket,
    })),
  };

  if (ctx.get('Capability') === 'pricing') {
    const product = await prisma.product.findUnique({ where: { id: booking.productId } });
    const price = product?.price ?? 0;
    const currency = product?.currency ?? 'EUR';
    result['price'] = price * booking.units.length;
    result['currency'] = currency;
    result.units = result.units.map((u: BookingUnit) => ({
      ...u,
      price,
      currency,
    }));
  }

  ctx.body = result;
});

router.post('/:id/confirm', async (ctx) => {
  const booking = await prisma.booking.update({
    where: { id: ctx.params.id },
    data: {
      status: 'CONFIRMED',
      units: {
        updateMany: {
          where: { bookingId: ctx.params.id },
          data: { ticket: randomBytes(4).toString('hex') },
        },
      },
    },
    include: { units: true },
  });

  const result: Record<string, any> = {
    id: booking.id,
    status: booking.status,
    productId: booking.productId,
    availabilityId: booking.availabilityId,
    units: booking.units.map((u: BookingUnit) => ({
      id: u.id,
      ticket: u.ticket,
    })),
  };

  if (ctx.get('Capability') === 'pricing') {
    const product = await prisma.product.findUnique({ where: { id: booking.productId } });
    const price = product?.price ?? 0;
    const currency = product?.currency ?? 'EUR';
    result['price'] = price * booking.units.length;
    result['currency'] = currency;
    result.units = result.units.map((u: BookingUnit) => ({
      ...u,
      price,
      currency,
    }));
  }

  ctx.body = result;
});

export default router;
