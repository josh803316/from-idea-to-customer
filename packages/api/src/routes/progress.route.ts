import Elysia, { t } from 'elysia';
import { upsertProgress, getProgress } from '../queries/progress.queries.ts';
import { optionalAuth } from '../middleware/auth.ts';

export const progressRoute = new Elysia()
  .derive(optionalAuth)
  .post(
    '/progress/sync',
    async ({ body, user }) => {
      const progress = await upsertProgress(
        body.sessionId,
        body.courseSlug,
        body.lessonSlug,
        body.completed,
        user?.id ?? null,
      );
      return { success: true, progress };
    },
    {
      body: t.Object({
        sessionId: t.String({ minLength: 1 }),
        courseSlug: t.String({ minLength: 1 }),
        lessonSlug: t.String({ minLength: 1 }),
        completed: t.Boolean(),
      }),
    },
  )
  .get(
    '/progress/:courseSlug',
    async ({ params, query, user }) => {
      const progress = await getProgress(
        params.courseSlug,
        query.sessionId,
        user?.id ?? null,
      );
      return { progress };
    },
    {
      query: t.Object({
        sessionId: t.Optional(t.String()),
      }),
    },
  );
