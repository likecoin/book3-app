<template>
  <UCard :ui="{ body: { base: 'space-y-6', padding: 'pt-10' } }">
    <AppLogo class="h-20 mx-auto" />

    <p
      class="flex justify-center items-center text-2xl text-gray-900 dark:text-white font-bold text-center"
    >
      Get started
    </p>

    <div class="relative group rounded-full">
      <div class="absolute -inset-[2px] rounded-[inherit] overflow-hidden">
        <div
          class="absolute inset-x-0 aspect-1 top-[50%] -translate-y-[50%] group-hover:rotate-[720deg] transition-transform duration-[2s] ease-[cubic-bezier(0.27,0,0.24,0.99)]"
          style="
            background: conic-gradient(
              from 180deg,
              #45e1e5 0deg,
              #0052ff 86.4deg,
              #b82ea4 165.6deg,
              #ff9533 255.6deg,
              #7fd057 320.4deg,
              #45e1e5 360deg
            );
          "
        />
      </div>
      <div class="relative rounded-[inherit] bg-black">
        <UButton
          color="white"
          size="xl"
          block
          :ui="{ rounded: 'rounded-full' }"
          @click="createWallet"
        >
          Sign in / Sign up
        </UButton>
      </div>
    </div>

    <UAccordion
      v-if="otherConnectors.length"
      :items="[{ slot: 'connectors' }]"
      :ui="{ wrapper: 'flex flex-col w-full' }"
    >
      <template #default="{ open }">
        <UButton class="flex justify-center items-center" variant="ghost" rounded>
          <span>Login with other methods</span>
          <UIcon :name="open ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" />
        </UButton>
      </template>

      <template #connectors>
        <ul class="space-y-2">
          <li v-for="connector in otherConnectors" :key="connector.name">
            <UButton
              size="xl"
              variant="outline"
              block
              @click="handleConnect(connector)"
            >
              {{ connector.name }}
            </UButton>
          </li>
        </ul>
      </template>
    </UAccordion>
  </UCard>
</template>

<script setup lang="ts">
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSignMessage,
  type Connector,
} from "@wagmi/vue";
import { SiweMessage } from "siwe";

import { useUserStore } from '../stores/user';

const chainId = useChainId();
const { connectors, connect } = useConnect();
const { disconnect } = useDisconnect();
const account = useAccount();
const userStore = useUserStore();
const toast = useToast();

function handleAuthError({
  error,
  title = "An error occurred.",
}: {
  error: Error;
  title?: string;
}) {
  console.error(error);
  disconnect();
  toast.add({
    title,
    color: 'red',
    description: error?.toString(),
    icon: 'i-heroicons-exclamation-triangle',
    timeout: 0,
  });
}

const otherConnectors = computed(() => connectors.filter(
  (connector) => connector.id !== "coinbaseWalletSDK"
));

const { signMessage } = useSignMessage({
  mutation: {
    onError: (error) => {
      handleAuthError({ error, title: "Failed to sign message." });
    },
    onSuccess: async (signature, { message }) => {
      if (!signature) {
        handleAuthError({ error: new Error("Failed to sign message.") });
        return;
      }

      const address = account.address?.value;
      if (!address) {
        handleAuthError({ error: new Error("Failed to fetch address.") });
        return;
      }

      try {
        await userStore.login({ address, signature, message });
      } catch (error) {
        handleAuthError({ error: error as Error, title: "Failed to login." });
        return;
      }
    },
  },
});

function handleConnect(connector: Connector) {
  if (account.isConnected) {
    disconnect();
  }

  connect(
    { 
      connector,
      chainId: chainId.value,
    },
    {
      onError(error) {
        handleAuthError({ error, title: "Failed to connect." });
      },
      onSuccess: async () => {
        let nonce;
        try {
          nonce = await $fetch("/api/users/nonce");
        } catch (error) {
          handleAuthError({ error: error as Error, title: "Failed to fetch nonce." });
          return;
        }
        if (!nonce) {
          console.error("Failed to fetch nonce.");
          disconnect();
          return;
        }

        const address = account.address?.value;
        if (!address) {
          handleAuthError({ error: new Error("Failed to get address.") });
          return;
        }

        const swieMessage = new SiweMessage({
          domain: document.location.host,
          address,
          chainId: account.chainId?.value,
          uri: document.location.origin,
          version: "1",
          statement: "Login to book3.app",
          nonce,
        });

        const message = swieMessage.prepareMessage();

        signMessage({ account: address, message });
      },
    }
  );
}

function createWallet() {
  const coinbaseWalletConnector = connectors.find(
    (connector) => connector.id === "coinbaseWalletSDK"
  );
  if (coinbaseWalletConnector) {
    handleConnect(coinbaseWalletConnector);
  }
}
</script>
