import { vi } from 'vitest';

export type MockRow = Record<string, unknown>;

/**
 * Replace the pg Pool singleton with a mock for a single test.
 *
 * Usage:
 *   const pool = mockPool([{ id: 1, email: 'a@b.com' }]);
 *   // pool.query is a vi.fn() you can assert against
 */
export function mockPool(rows: MockRow[] = []) {
  const pool = {
    query: vi.fn().mockResolvedValue({ rows, rowCount: rows.length }),
    connect: vi.fn(),
    end: vi.fn(),
    on: vi.fn(),
  };

  vi.doMock('../src/db/index.ts', () => ({
    getPool: () => pool,
    resetPool: vi.fn(),
  }));

  return pool;
}
