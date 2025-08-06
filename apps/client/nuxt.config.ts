import tailwindcss from "@tailwindcss/vite";

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
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
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