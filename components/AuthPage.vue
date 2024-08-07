<template>
  <UCard :ui="{ body: { base: 'space-y-6' } }">
    <AppLogo class="w-10 mx-auto" />

    <p
      class="flex justify-center items-center text-2xl text-gray-900 dark:text-white font-bold text-center"
    >
      Get started
      <UIcon
        class="w-10 h-10 ml-2"
        name="i-heroicons-arrow-left-end-on-rectangle"
      />
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
          <svg
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.66675 15.9998C2.66675 23.3628 8.63712 29.3332 16.0001 29.3332C23.363 29.3332 29.3334 23.3628 29.3334 15.9998C29.3334 8.63687 23.363 2.6665 16.0001 2.6665C8.63712 2.6665 2.66675 8.63687 2.66675 15.9998ZM12.5927 11.7035H19.4075C19.9001 11.7035 20.2964 12.0998 20.2964 12.5924V19.4072C20.2964 19.8998 19.9001 20.2961 19.4075 20.2961H12.5927C12.1001 20.2961 11.7038 19.8998 11.7038 19.4072V12.5924C11.7038 12.0998 12.1001 11.7035 12.5927 11.7035Z"
              fill="white"
            />
          </svg>
          Create Wallet
        </UButton>
      </div>
    </div>

    <UDivider label="or connect an existing wallet" />

    <UButton
      v-for="connector in connectors"
      :key="connector.name"
      size="xl"
      block
      @click="handleConnect(connector)"
    >
      {{ connector.name }}
    </UButton>
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
const toast = useToast()

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
  connect(
    { connector, chainId: chainId.value },
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
