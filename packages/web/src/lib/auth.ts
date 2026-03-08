/**
 * Neon Auth client — singleton used across all React islands.
 *
 * Built on Better Auth via @neondatabase/neon-js.
 * Configured with VITE_/PUBLIC_ env var so it's safe to use in browser code.
 *
 * Usage in a React island:
 *   import { authClient } from '@/lib/auth';
 *   const { data: session } = await authClient.getSession();
 *   const { data } = await authClient.token();  // get JWT for API calls
 */

import { createAuthClient } from '@neondatabase/neon-js/auth';

const NEON_AUTH_URL = import.meta.env.PUBLIC_NEON_AUTH_URL;

if (!NEON_AUTH_URL) {
  throw new Error('PUBLIC_NEON_AUTH_URL is required');
}

export const authClient = createAuthClient(NEON_AUTH_URL);

export type AuthSession = Awaited<ReturnType<typeof authClient.getSession>>['data'];
export type AuthUser = NonNullable<AuthSession>['user'];
