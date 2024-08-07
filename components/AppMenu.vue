<template>
  <UCard
    :ui="{
      base: 'flex flex-col h-full',
      rounded: 'rounded-none',
      body: { base: 'grow' },
      footer: { base: 'space-y-2' },
    }"
  >
    <template #header>
      <AppLogo class="w-10" />
    </template>

    <div class="flex flex-col gap-2 grow">
      <UVerticalNavigation :links="menuLinks" />
    </div>

    <template #footer>
      <div class="flex items-center gap-1">
        <UBadge
          :label="`${shortenAddress}`"
          :ui="{ base: 'w-full', font: 'font-mono' }"
        />
        <UButton
          icon="i-heroicons-clipboard-document"
          variant="outline"
          size="xs"
        />
      </div>

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

const shortenAddress = computed(() => {
  if (!userStore.address) return "-";
  return `${userStore.address.slice(0, 12)}...${userStore.address.slice(-8)}`;
});

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
