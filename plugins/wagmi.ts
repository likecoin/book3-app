import { WagmiPlugin, http, createConfig } from '@wagmi/vue'
import { baseSepolia } from '@wagmi/core/chains'
import { coinbaseWallet } from '@wagmi/connectors'
import { VueQueryPlugin } from '@tanstack/vue-query'

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'book3.app 🐹',
      preference: 'smartWalletOnly',
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
})

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(WagmiPlugin, { config })
  nuxtApp.vueApp.use(VueQueryPlugin, {})
})
