import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { optimismSepolia, type AppKitNetwork } from "@reown/appkit/networks";

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [optimismSepolia];

export function createAppKitWagmiAdapter(projectId: string) {
  return new WagmiAdapter({
    networks,
    projectId,
  });
}
