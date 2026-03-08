/**
 * Server-side JWT verification for Astro SSR endpoints.
 * Uses the same Neon Auth JWKS endpoint as the Elysia API.
 *
 * Used in: src/pages/api/progress.ts
 */

import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

export interface NeonAuthUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
}

let JWKS: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!JWKS) {
    const base = import.meta.env.NEON_AUTH_BASE_URL;
    if (!base) throw new Error('NEON_AUTH_BASE_URL is required');
    JWKS = createRemoteJWKSet(new URL(`${base}/.well-known/jwks.json`));
  }
  return JWKS;
}

export async function verifyJwt(token: string): Promise<(JWTPayload & NeonAuthUser) | null> {
  try {
    const base = import.meta.env.NEON_AUTH_BASE_URL!;
    const issuer = new URL(base).origin;
    const { payload } = await jwtVerify(token, getJWKS(), { issuer });
    return payload as JWTPayload & NeonAuthUser;
  } catch {
    return null;
  }
}

export function extractBearer(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  return auth.slice(7);
}
