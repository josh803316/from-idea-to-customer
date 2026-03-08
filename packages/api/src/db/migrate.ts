/**
 * Migration runner — applies SQL files from db/migrations/ in numeric order.
 *
 * Convention:
 *   - Files must be named NNN_description.sql (e.g. 001_initial_schema.sql)
 *   - Each file is applied exactly once, tracked in schema_migrations table
 *   - Each file is applied inside a transaction; failure rolls back cleanly
 *
 * Run: bun src/db/migrate.ts
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('[MIGRATE] DATABASE_URL is required');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

// Bun exposes import.meta.dir; Node.js polyfill via URL if needed.
const migrationsDir = join(
  typeof import.meta.dir !== 'undefined' ? import.meta.dir : new URL('.', import.meta.url).pathname,
  '../../db/migrations',
);

async function migrate(): Promise<void> {
  const client = await pool.connect();
  try {
    // Ensure the tracking table exists.
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename   TEXT        PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const files = (await readdir(migrationsDir))
      .filter((f) => f.endsWith('.sql'))
      .sort(); // lexicographic sort preserves NNN_ prefix ordering

    for (const file of files) {
      const { rowCount } = await client.query(
        'SELECT 1 FROM schema_migrations WHERE filename = $1',
        [file],
      );

      if (rowCount && rowCount > 0) {
        console.log(`[SKIP]  ${file}`);
        continue;
      }

      console.log(`[APPLY] ${file}`);
      const sql = await readFile(join(migrationsDir, file), 'utf-8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`[DONE]  ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }

    console.log('[MIGRATE] All migrations complete.');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('[MIGRATE FAILED]', err);
  process.exit(1);
});
