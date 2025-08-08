import tailwindcss from "@tailwindcss/vite";
import { validateEnv } from './app/config/env.validation';

// Validate environment variables
const envVars = validateEnv();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  imports: {
    dirs: ['composables/**']
  },

  css: ['~/assets/css/app.css', '~/assets/css/nuxt-ui-overrides.css'],
  pages: true,
  router: {
    options: {
      strict: false
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: ['monaco-editor']
    },
    define: {
      global: 'globalThis'
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: envVars.API_BASE_URL,
      tokenRefreshIntervalMs: envVars.TOKEN_REFRESH_INTERVAL_MS,
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  build: {
    transpile: ['monaco-editor']
  }
})