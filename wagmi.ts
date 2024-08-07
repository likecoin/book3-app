import { http, createConfig } from '@wagmi/vue'
import { baseSepolia } from '@wagmi/core/chains'
import { coinbaseWallet } from '@wagmi/connectors'

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "book3.app 🐹",
      preference: "smartWalletOnly",
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});

declare module "@wagmi/vue" {
  interface Register {
    config: typeof config
  }
};

