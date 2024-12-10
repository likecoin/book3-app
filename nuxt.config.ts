// https://nuxt.com/docs/api/configuration/nuxt-config
import veauryVitePlugins from "veaury/vite/index.js";

export default defineNuxtConfig({
  app: {
    rootAttrs: {
      class: "h-full min-h-svh",
    },
  },
  compatibilityDate: "2024-04-03",
  runtimeConfig: {
    public: {
      privyAppId: "cm38yfagh00iqaegqad5wbbpo",
    },
  },
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@pinia/nuxt",
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
  vite: {
    plugins: [
      veauryVitePlugins({
        type: "vue",
        isNuxt: true,
      }),
    ],
  },
});
