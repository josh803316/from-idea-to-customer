import { getPool } from './index.ts';

/**
 * Tagged-template SQL helper.
 *
 * Usage:
 *   const rows = await query<User>`SELECT * FROM users WHERE id = ${id}`;
 *
 * Interpolated values are extracted as positional parameters ($1, $2, …)
 * so the query is never vulnerable to SQL injection.
 */
export async function query<T = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  let text = '';
  const params: unknown[] = [];

  strings.forEach((str, i) => {
    text += str;
    if (i < values.length) {
      params.push(values[i]);
      text += `$${params.length}`;
    }
  });

  const pool = getPool();
  const result = await pool.query(text, params);
  return result.rows as T[];
}
