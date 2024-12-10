<template>
  <UCard
    :ui="{
      body: { base: 'space-y-6', padding: 'pt-10' },
      rounded: 'rounded-none lg:rounded-lg',
    }"
  >
    <AppLogo class="h-20 mx-auto" />

    <p
      class="flex justify-center items-center text-2xl text-gray-900 dark:text-white font-bold text-center"
      v-text="$t('auth_page_tagline')"
    />

    <UButton
      :label="$t('auth_page_sign_in_or_sign_up_button_label')"
      color="white"
      size="xl"
      :disabled="isPrivyAuthenticated"
      block
      :ui="{ rounded: 'rounded-full' }"
      @click="login"
    />
  </UCard>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const toast = useToast();

const { isPrivyAuthenticated, isPrivyReady } = storeToRefs(userStore);

function handleAuthError({
  error,
  title = "An error occurred.",
}: {
  error: Error;
  title?: string;
}) {
  console.error(error);
  toast.add({
    title,
    color: "red",
    description: error.message || error?.toString(),
    icon: "i-heroicons-exclamation-triangle",
    timeout: 0,
  });
}

function login() {
  if (!isPrivyReady.value || isPrivyAuthenticated.value) {
    return;
  }
  try {
    userStore.login();
  } catch (error) {
    handleAuthError({ error: error as Error });
  }
}
</script>
