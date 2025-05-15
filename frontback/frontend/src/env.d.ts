/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOGIN_API: string;
  readonly VITE_REGISTER_API: string;
  readonly VITE_PROFILE_API: string;
  readonly VITE_USER_ORDERS_API: string;
  readonly VITE_GET_ALL_RESTAURANTS_API: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
