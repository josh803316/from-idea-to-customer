import Elysia from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { healthRoute } from './routes/health.route.ts';
import { emailRoute } from './routes/email.route.ts';
import { progressRoute } from './routes/progress.route.ts';
import { modelsRoute } from './routes/models.route.ts';

const PORT = Number(process.env.PORT ?? 4322);

const app = new Elysia()
  .use(swagger({ path: '/docs' }))
  .use(
    cors({
      origin: process.env.WEB_URL ?? 'http://localhost:4321',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    }),
  )
  .onRequest(({ request }) => {
    console.log(`[REQUEST] ${request.method} ${new URL(request.url).pathname}`);
  })
  .use(healthRoute)
  .use(emailRoute)
  .use(progressRoute)
  .use(modelsRoute)
  .onError(({ error, code, request }) => {
    const url = new URL(request.url);
    const msg = error instanceof Error ? error.message : String(error);
    if (code === 'NOT_FOUND') {
      console.log(`[404] ${request.method} ${url.pathname}`);
      return { error: 'Not found' };
    }
    console.error(`[ERROR] ${request.method} ${url.pathname} - ${code} - ${msg}`);
    return { error: 'Internal server error' };
  });

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT);
  console.log(`FITC API running at http://localhost:${PORT}`);
}

export type App = typeof app;
export default app;
