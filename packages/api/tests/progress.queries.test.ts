import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/db/index.ts', () => ({
  getPool: vi.fn(),
  resetPool: vi.fn(),
}));

import { getPool } from '../src/db/index.ts';
import { upsertProgress, getProgress } from '../src/queries/progress.queries.ts';

const mockRow = {
  id: 1,
  session_id: 'sess-abc',
  course_slug: 'idea-to-customer',
  lesson_slug: 'lesson-01',
  completed: true,
  completed_at: new Date(),
  created_at: new Date(),
  updated_at: new Date(),
};

function makeMockPool(rows: unknown[] = []) {
  const pool = { query: vi.fn().mockResolvedValue({ rows, rowCount: rows.length }) };
  vi.mocked(getPool).mockReturnValue(pool as any);
  return pool;
}

describe('upsertProgress', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the upserted row', async () => {
    makeMockPool([mockRow]);
    const result = await upsertProgress('sess-abc', 'idea-to-customer', 'lesson-01', true);
    expect(result.completed).toBe(true);
    expect(result.session_id).toBe('sess-abc');
  });

  it('passes false for completed_at when not completed', async () => {
    const pool = makeMockPool([{ ...mockRow, completed: false, completed_at: null }]);
    await upsertProgress('sess-abc', 'idea-to-customer', 'lesson-01', false);
    const callArgs = pool.query.mock.calls[0];
    // null should be in the params for completed_at
    expect(callArgs[1]).toContain(null);
  });
});

describe('getProgress', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns all progress rows for a session+course', async () => {
    makeMockPool([mockRow, { ...mockRow, id: 2, lesson_slug: 'lesson-02' }]);
    const result = await getProgress('sess-abc', 'idea-to-customer');
    expect(result).toHaveLength(2);
  });

  it('returns empty array when no progress recorded', async () => {
    makeMockPool([]);
    const result = await getProgress('sess-xyz', 'idea-to-customer');
    expect(result).toEqual([]);
  });
});
