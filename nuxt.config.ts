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
  modules: ["@nuxt/ui", "@nuxt/eslint", "@pinia/nuxt"],
  hooks: {
    "vite:extendConfig": (viteInlineConfig) => {
      // https://github.com/wevm/wagmi/issues/3977#issuecomment-2154424681
      viteInlineConfig.optimizeDeps ??= {}
      viteInlineConfig.optimizeDeps.include = viteInlineConfig.optimizeDeps.include || []
      viteInlineConfig.optimizeDeps.include.push("eventemitter3")
    }
  }
})
