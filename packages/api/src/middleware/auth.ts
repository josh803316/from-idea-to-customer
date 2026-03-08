/**
 * Neon Auth JWT verification middleware for Elysia.
 *
 * Neon Auth issues EdDSA (Ed25519) JWTs with a 15-minute expiry.
 * We verify them using the public JWKS endpoint — no shared secret needed.
 *
 * Usage in a route:
 *   .derive(verifyAuth)            // adds ctx.user (throws 401 if invalid)
 *   .derive(optionalAuth)          // adds ctx.user (null if no/invalid token)
 */

import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

export interface NeonAuthUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  role: string;
}

const NEON_AUTH_BASE_URL = process.env.NEON_AUTH_BASE_URL;

function getJWKS() {
  if (!NEON_AUTH_BASE_URL) {
    throw new Error('NEON_AUTH_BASE_URL is required');
  }
  const jwksUrl = new URL(`${NEON_AUTH_BASE_URL}/.well-known/jwks.json`);
  // createRemoteJWKSet caches the keys internally — safe to call per-request
  return createRemoteJWKSet(jwksUrl);
}

function extractBearer(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

async function verifyToken(token: string): Promise<(JWTPayload & NeonAuthUser) | null> {
  try {
    const issuer = new URL(NEON_AUTH_BASE_URL!).origin;
    const { payload } = await jwtVerify(token, getJWKS(), { issuer });
    return payload as JWTPayload & NeonAuthUser;
  } catch {
    return null;
  }
}

/** Require a valid JWT — returns 401 if absent or invalid. */
export async function verifyAuth({ request, set }: { request: Request; set: any }) {
  const token = extractBearer(request);
  if (!token) {
    set.status = 401;
    return { error: 'Authentication required' };
  }
  const user = await verifyToken(token);
  if (!user) {
    set.status = 401;
    return { error: 'Invalid or expired token' };
  }
  return { user };
}

/** Optional JWT — populates user if token is present and valid, null otherwise. */
export async function optionalAuth({ request }: { request: Request }) {
  const token = extractBearer(request);
  if (!token) return { user: null };
  const user = await verifyToken(token);
  return { user: user ?? null };
}
