/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly YOU_API_KEY: string;
  readonly PUBLIC_API_URL: string;
  readonly PUBLIC_NEON_AUTH_URL: string;
  readonly GOOGLE_PSI_API_KEY: string;
  readonly GA4_PROPERTY_ID: string;
  readonly GA4_SERVICE_ACCOUNT_B64: string;
  readonly PUBLIC_GA4_MEASUREMENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}