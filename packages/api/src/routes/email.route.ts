import Elysia, { t } from 'elysia';
import { insertSubscriber, findSubscriberByEmail } from '../queries/email.queries.ts';

export const emailRoute = new Elysia().post(
  '/email/subscribe',
  async ({ body, set }) => {
    const existing = await findSubscriberByEmail(body.email);
    if (existing) {
      set.status = 409;
      return { error: 'Already subscribed' };
    }

    await insertSubscriber(body.email, body.source);
    set.status = 201;
    return { success: true, message: 'Thanks for subscribing!' };
  },
  {
    body: t.Object({
      email: t.String({ format: 'email', minLength: 3 }),
      source: t.Optional(t.String()),
    }),
  },
);
