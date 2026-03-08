import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/db/index.ts', () => ({
  getPool: vi.fn(),
  resetPool: vi.fn(),
}));

import { getPool } from '../src/db/index.ts';
import { healthRoute } from '../src/routes/health.route.ts';

function makeMockPool(queryFn: () => Promise<unknown>) {
  const pool = { query: vi.fn().mockImplementation(queryFn) };
  vi.mocked(getPool).mockReturnValue(pool as any);
  return pool;
}

describe('GET /health', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns status ok and db ok when database is reachable', async () => {
    makeMockPool(() => Promise.resolve({ rows: [{ '?column?': 1 }] }));

    const response = await healthRoute.handle(new Request('http://localhost/health'));
    const body = await response.json();

    expect(body.status).toBe('ok');
    expect(body.db).toBe('ok');
    expect(body.version).toBeDefined();
  });

  it('returns db: error when database query fails', async () => {
    makeMockPool(() => Promise.reject(new Error('connection refused')));

    const response = await healthRoute.handle(new Request('http://localhost/health'));
    const body = await response.json();

    expect(body.status).toBe('ok');
    expect(body.db).toBe('error');
  });
});
