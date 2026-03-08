import pg from 'pg';

// Lazy singleton — pool is created only when first requested.
// This prevents connection errors at import time in test environments.
let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    pool = new pg.Pool({
      connectionString,
      // Neon requires SSL; rejectUnauthorized: false works with self-signed certs.
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30_000,
    });

    pool.on('error', (err) => {
      console.error('[DB POOL ERROR]', err.message);
    });
  }
  return pool;
}

// Exposed so tests can reset the singleton between runs.
export function resetPool(): void {
  pool = null;
}
