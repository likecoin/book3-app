<template>
  <div class="flex h-full">
    <ClientOnly>
      <UModal
        :model-value="!userStore.address"
        :ui="{
          fullscreen: 'h-svh',
          overlay: { background: 'bg-gray-200 dark:bg-gray-800' }
        }"
        prevent-close
      >
        <AuthPage />
      </UModal>
    </ClientOnly>

    <AppMenu class="w-full max-w-[320px] border-r border-gray-200 dark:border-gray-800" />
  
    <NuxtPage />

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from './stores/user';

const userStore = useUserStore()

useHead({
  htmlAttrs: {
    class: 'h-full',
  },
  bodyAttrs: {
    class: 'h-full text-gray-700 dark:text-gray-200 dark:bg-gray-900'
  },
});

useSeoMeta({
  title: 'book3.app',
  ogTitle: 'book3.app',
});

await callOnce(userStore.fetchSettings).catch((() => {}));
</script>
