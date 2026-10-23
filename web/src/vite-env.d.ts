/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Token de acesso do Mapbox. */
  readonly VITE_MAPBOX_ACCESS_TOKEN?: string;
  /** URL base do backend. Vazio/ausente cai no fallback local. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
