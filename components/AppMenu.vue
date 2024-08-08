<template>
  <UCard
    :ui="{
      base: 'flex flex-col h-full',
      rounded: 'rounded-none',
      header: { base: 'flex items-center gap-4' },
      body: { base: 'grow' },
      footer: { base: 'space-y-2 pb-6 sm:pb-auto' },
    }"
  >
    <template #header>
      <AppLogo class="w-6" />
      <span class="font-mono font-bold">book3.app</span>
    </template>

    <div class="flex flex-col gap-2 grow">
      <UVerticalNavigation :links="menuLinks" />
    </div>

    <template #footer>
      <UButton variant="outline" size="xl" block @click="logout">
        Logout
      </UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { useDisconnect } from "@wagmi/vue";

import { useUserStore } from '../stores/user';

const userStore = useUserStore()

const { disconnect } = useDisconnect();

const menuLinks = [
  {
    label: "Books",
    icon: "i-heroicons-book-open",
    to: "/",
  },
  {
    label: "Settings",
    icon: "i-heroicons-cog-8-tooth",
    to: "/settings",
  },
];

async function logout() {
  try {
    await userStore.logout();
  } catch (error) {
    console.error(error);
  } finally {
    disconnect();
  }
}
</script>
