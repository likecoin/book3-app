// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    rootAttrs: {
      class: "h-full min-h-svh",
    },
  },
  compatibilityDate: "2024-04-03",
  runtimeConfig: {
    public: {
      appKitProjectId: "526a2e1c9bf37fb75a7e0a4b11d6008e",
    },
  },
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@pinia/nuxt",
    "@wagmi/vue/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/i18n",
  ],
  i18n: {
    vueI18n: "./i18n/config.ts",
    locales: [
      { code: "en", name: "English" },
      { code: "zh-Hant", name: "繁體中文" },
    ],
  },
});
