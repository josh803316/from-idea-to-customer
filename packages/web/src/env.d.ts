/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly YOU_API_KEY: string;
  readonly PUBLIC_API_URL: string;
  readonly PUBLIC_NEON_AUTH_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}