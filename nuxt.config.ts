import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
  srcDir: "src",
  css: ["@/styles/global.css"],
  modules: ["@pinia/nuxt", "@nuxt/ui", "@nuxt/content"],
  devtools: { enabled: true },
  app: {
    head: {
      style: [{ innerHTML: 'body{opacity:0}' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
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