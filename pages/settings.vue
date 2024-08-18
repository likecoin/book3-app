<template>
  <div class="flex flex-col items-stretch flex-grow">
    <AppPageHeader title="Settings" />

    <AppPageBody :ui="{ constrained: 'max-w-screen-md' }">
      <UFormGroup label="Account">
        <UInput
          class="font-mono"
          :model-value="userStore.address"
          icon="i-heroicons-key"
          size="lg"
          :disabled="true"
        >
          <template #trailing>
            <UButton
              class="pointer-events-auto"
              icon="i-heroicons-clipboard-document"
              variant="ghost"
              size="xs"
              :disabled="!userStore.address"
              @click="copyAddress"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UButton variant="outline" block size="xl" @click="signOut">
        Sign out
      </UButton>
    </AppPageBody>
  </div>
</template>

<script setup lang="ts">
import { useDisconnect } from "@wagmi/vue";

import { useUserStore } from "../stores/user";

const { disconnect } = useDisconnect();
const userStore = useUserStore();

const toast = useToast();

function copyAddress() {
  navigator.clipboard.writeText(userStore.address);
  toast.add({
    id: "copy-address",
    title: "Copied address to clipboard",
  });
}

async function signOut() {
  try {
    await userStore.logout();
  } catch (error) {
    console.error(error);
  } finally {
    disconnect();
  }
}
</script>
