<template>
  <div class="flex flex-col">
    <AppHeaderBase class="w-full px-5">
      <AppLogo class="h-6" />
      <span class="font-mono font-bold">book3.app</span>
    </AppHeaderBase>

    <div class="flex flex-col gap-4 grow w-full p-5">
      <UVerticalNavigation class="grow" :links="menuLinks" />

      <UButton variant="outline" size="xl" block @click="logout">
        Logout
      </UButton>
    </div>
  </div>
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
