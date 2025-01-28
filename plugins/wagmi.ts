import { WagmiPlugin } from "@wagmi/vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { defineNuxtPlugin } from "nuxt/app";

import { createAppKitWagmiAdapter } from "../appkit";

// NOTE: Possibly will move to @wagmi/vue/nuxt nitro plugin
export default defineNuxtPlugin((nuxtApp) => {
  const { appKitProjectId } = useRuntimeConfig().public;
  const wagmiAdapter = createAppKitWagmiAdapter(appKitProjectId);
  nuxtApp.vueApp
    .use(WagmiPlugin, { config: wagmiAdapter.wagmiConfig })
    .use(VueQueryPlugin, {});
});
