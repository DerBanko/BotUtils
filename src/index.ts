import { Hono } from 'hono';
import relativeTime from './routes/relative-time';
import { Scalar } from '@scalar/hono-api-reference';

const app = new Hono();

app.get('/', (c) => {
  return c.json({ status: 'ok' });
});

app.route('/relative-time', relativeTime);

export default app;
