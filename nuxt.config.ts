// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    rootAttrs: {
      class: "h-full min-h-svh",
    }
  },
  compatibilityDate: "2024-04-03",
  runtimeConfig: {
    sessionSecret: process.env.SESSION_SECRET || "00000000-0000-0000-0000-000000000000",
  },
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@pinia/nuxt", "@wagmi/vue/nuxt"],
})
