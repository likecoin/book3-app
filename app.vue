<template>
  <div class="fixed inset-0 flex">
    <ClientOnly>
      <PrivyReactBridge
        @ready-change="userStore.setIsPrivyReady"
        @authenticated-change="userStore.setIsPrivyAuthenticated"
        @user-change="userStore.setPrivyUser"
        @login-method-change="userStore.setPrivyLogin"
        @logout-method-change="userStore.setPrivyLogout"
      />
    </ClientOnly>

    <div
      v-if="!isPrivyReady"
      class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 text-center bg-white dark:bg-gray-900"
    >
      <AppLogo class="h-20 mx-auto" />
      <div class="text-2xl font-bold" v-text="APP_NAME" />
      <div
        class="flex flex-col items-center justify-center text-sm text-gray-400"
      >
        <UIcon
          class="w-10 h-10 mx-auto animate-spin"
          name="i-heroicons-arrow-path-20-solid"
        />
        <div v-text="$t('$loading')" />
      </div>
    </div>

    <UModal
      :model-value="isPrivyReady && !isPrivyAuthenticated"
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
      :class="['overflow-y-auto', { 'opacity-0': !isPrivyAuthenticated }]"
    />

    <NuxtLoadingIndicator />

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import { setVeauryOptions } from "veaury";
import { createRoot } from "react-dom/client";

setVeauryOptions({
  react: {
    createRoot,
  },
});

const APP_NAME = "book3.app";

const userStore = useUserStore();
const { isPrivyAuthenticated, isPrivyReady } = storeToRefs(userStore);
const uiStore = useUIStore();
const { t: $t } = useI18n();

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
  title: APP_NAME,
  ogTitle: APP_NAME,
});
</script>
