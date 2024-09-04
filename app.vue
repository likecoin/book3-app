<template>
  <div class="fixed inset-0 flex">
    <UModal
      :model-value="!userStore.address"
      :ui="{
        padding: 'p-0',
        rounded: 'rounded-none lg:rounded-lg',
        overlay: { background: 'bg-gray-200 dark:bg-gray-800' },
      }"
      :transition="false"
      prevent-close
    >
      <AuthPage />
    </UModal>

    <AppMenu
      :class="[
        'max-lg:hidden',
        'overflow-y-auto',
        'w-full',
        'max-w-[320px]',
        'border-r',
        'border-gray-200 dark:border-gray-800',
      ]"
    />
    <USlideover
      v-model="isMobileMenuOpen"
      side="left"
      :ui="{ base: 'flex flex-col' }"
    >
      <UButton
        color="gray"
        variant="ghost"
        icon="i-heroicons-x-mark-20-solid"
        class="absolute top-4 right-4 z-20"
        square
        padded
        @click="isMobileMenuOpen = false"
      />
      <AppMenu class="grow overflow-y-auto" />
    </USlideover>

    <NuxtPage
      :class="['overflow-y-auto', { 'opacity-0': !userStore.address }]"
    />

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
watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false;
  },
);

useHead({
  htmlAttrs: {
    class: "h-dvh",
  },
  bodyAttrs: {
    class: "h-dvh text-gray-700 dark:text-gray-200 dark:bg-gray-900",
    style: "padding-bottom: env(safe-area-inset-bottom);",
  },
  meta: [
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
    },
  ],
  link: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    { rel: "manifest", href: "/site.webmanifest" },
  ],
});

useSeoMeta({
  title: "book3.app",
  ogTitle: "book3.app",
});

await callOnce(async () => {
  try {
    await userStore.fetchSettings();
  } catch {
    // Ignore
  }
});
</script>
