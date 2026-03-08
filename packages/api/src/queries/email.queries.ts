import { query } from '../db/query.ts';

export interface Subscriber {
  id: number;
  email: string;
  source: string | null;
  confirmed: boolean;
  created_at: Date;
  updated_at: Date;
}

export async function insertSubscriber(email: string, source?: string): Promise<Subscriber> {
  const rows = await query<Subscriber>`
    INSERT INTO subscribers (email, source)
    VALUES (${email}, ${source ?? null})
    RETURNING *
  `;
  return rows[0];
}

export async function findSubscriberByEmail(email: string): Promise<Subscriber | null> {
  const rows = await query<Subscriber>`
    SELECT * FROM subscribers WHERE email = ${email}
  `;
  return rows[0] ?? null;
}
