import Elysia from 'elysia';
import { getPool } from '../db/index.ts';

export const healthRoute = new Elysia().get('/health', async () => {
  let dbStatus: 'ok' | 'error' = 'ok';
  try {
    await getPool().query('SELECT 1');
  } catch {
    dbStatus = 'error';
  }

  return {
    status: 'ok',
    db: dbStatus,
    version: process.env.npm_package_version ?? '0.1.0',
  };
});
