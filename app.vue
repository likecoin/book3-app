<template>
  <div class="fixed inset-0 flex">
    <UModal
      :model-value="!userStore.address"
      :ui="{
        padding: 'p-0',
        rounded: 'rounded-none lg:rounded-lg',
        overlay: { background: 'bg-gray-200 dark:bg-gray-800' }
      }"
      :transition="false"
      prevent-close
    >
      <AuthPage class="pb-6" />
    </UModal>

    <AppMenu class="hidden lg:flex w-full max-w-[320px] border-r border-gray-200 dark:border-gray-800" />
    <USlideover v-model="isMobileMenuOpen" side="left">
      <UButton
        color="gray"
        variant="ghost"
        size="sm"
        icon="i-heroicons-x-mark-20-solid"
        class="flex absolute end-4 top-4 z-10"
        square
        padded
        @click="isMobileMenuOpen = false"
      />
      <AppMenu />
    </USlideover>
    
    <NuxtPage :class="['overflow-y-auto', { 'opacity-0': !userStore.address }]" />

    <NuxtLoadingIndicator />

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const uiStore = useUIStore();

const isMobileMenuOpen = computed({
  get: () => uiStore.isMobileMenuOpen,
  set: (value) => uiStore.setIsMobileMenuOpen(value),
});

const route = useRoute();

// NOTE: Close mobile menu on route change
watch(() => route.fullPath, () => {
  isMobileMenuOpen.value = false
});

useHead({
  htmlAttrs: {
    class: 'h-svh',
  },
  bodyAttrs: {
    class: 'h-svh text-gray-700 dark:text-gray-200 dark:bg-gray-900',
    style: 'padding-bottom: env(safe-area-inset-bottom);',
  },
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" },
  ],
  link: [
    { rel: "apple-touch-icon", sizes: "180x180" ,href: "/apple-touch-icon.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
    { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
    { rel: "manifest", href: "/site.webmanifest" },
  ],
});

useSeoMeta({
  title: 'book3.app',
  ogTitle: 'book3.app',
});

await callOnce(async () => {
  try {
    await userStore.fetchSettings();
  } catch {
    // Ignore
  }
});
</script>
