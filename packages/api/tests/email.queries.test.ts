import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the DB module before importing anything that depends on it.
vi.mock('../src/db/index.ts', () => ({
  getPool: vi.fn(),
  resetPool: vi.fn(),
}));

import { getPool } from '../src/db/index.ts';
import { insertSubscriber, findSubscriberByEmail } from '../src/queries/email.queries.ts';

const mockRow = {
  id: 1,
  email: 'test@example.com',
  source: null,
  confirmed: false,
  created_at: new Date(),
  updated_at: new Date(),
};

function makeMockPool(rows: unknown[] = []) {
  const pool = { query: vi.fn().mockResolvedValue({ rows, rowCount: rows.length }) };
  vi.mocked(getPool).mockReturnValue(pool as any);
  return pool;
}

describe('insertSubscriber', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the created subscriber row', async () => {
    const pool = makeMockPool([mockRow]);
    const result = await insertSubscriber('test@example.com');
    expect(result.email).toBe('test@example.com');
    expect(pool.query).toHaveBeenCalledOnce();
  });

  it('passes source to the query when provided', async () => {
    const pool = makeMockPool([{ ...mockRow, source: 'homepage' }]);
    const result = await insertSubscriber('test@example.com', 'homepage');
    expect(result.source).toBe('homepage');
    // Verify the SQL params include the source value
    const callArgs = pool.query.mock.calls[0];
    expect(callArgs[1]).toContain('homepage');
  });
});

describe('findSubscriberByEmail', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the subscriber when found', async () => {
    makeMockPool([mockRow]);
    const result = await findSubscriberByEmail('test@example.com');
    expect(result?.email).toBe('test@example.com');
  });

  it('returns null when no subscriber found', async () => {
    makeMockPool([]);
    const result = await findSubscriberByEmail('missing@example.com');
    expect(result).toBeNull();
  });
});
