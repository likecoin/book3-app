import { WagmiPlugin } from "@wagmi/vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { defineNuxtPlugin } from "nuxt/app";

import { config } from "../wagmi";

// NOTE: Possibly will move to @wagmi/vue/nuxt nitro plugin
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(WagmiPlugin, { config }).use(VueQueryPlugin, {})
});
