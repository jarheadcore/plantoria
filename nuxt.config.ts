import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
  srcDir: "src",
  css: ["@/styles/global.css"],
  modules: ["@pinia/nuxt", "@nuxt/ui", "@nuxt/content"],
  devtools: { enabled: true },
  compatibilityDate: '2026-02-06'
})