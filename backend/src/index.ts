import Koa from 'koa';
import cors from '@koa/cors';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import productRoutes from './routes/products';
import availabilityRoutes from './routes/availability';
import bookingRoutes from './routes/bookings';

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(bodyParser());
app.use(productRoutes.routes());
app.use(availabilityRoutes.routes());
app.use(bookingRoutes.routes());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
