// src/app.ts
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import productsRoutes from './routes/products';
import availabilityRoutes from './routes/availability';
import bookingsRoutes from './routes/bookings';

const app = new Koa();

app.use(cors());
app.use(bodyParser());
app.use(productsRoutes.routes());
app.use(availabilityRoutes.routes());
app.use(bookingsRoutes.routes());

export default app;
