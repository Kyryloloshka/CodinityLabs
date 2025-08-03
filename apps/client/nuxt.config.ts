import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  css: ['~/assets/css/app.css'],
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
  ui: {
    global: true,
    icons: ['heroicons']
  }
})