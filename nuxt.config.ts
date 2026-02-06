import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
  srcDir: "src",
  css: ["@/styles/global.css"],
  modules: ["@pinia/nuxt", "@nuxt/ui", "@nuxt/content"],
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  compatibilityDate: '2026-02-06',
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  ui: {
    theme: {
      colors: ['green'],
    },
  },
})