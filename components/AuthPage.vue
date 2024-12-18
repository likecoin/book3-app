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
      block
      :disabled="isAppKitModalOpen"
      :loading="isAppKitModalOpen"
      :ui="{ rounded: 'rounded-full' }"
      @click="loginWithAppKit"
    />
  </UCard>
</template>

<script setup lang="ts">
import { useAppKit, useAppKitState } from "@reown/appkit/vue";

const { open: openAppKit } = useAppKit();
const { open: isAppKitModalOpen } = useAppKitState();

function loginWithAppKit() {
  if (isAppKitModalOpen) return;
  openAppKit();
}
</script>
