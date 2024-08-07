<template>
  <div class="flex flex-col items-stretch flex-grow">
    <header
      class="flex justify-start gap-4 px-10 py-4 border-b border-gray-200 dark:border-gray-800"
    >
      <h1 class="font-bold text-xl">Settings</h1>
    </header>

    <UContainer class="w-full py-6" as="main">
      <UFormGroup label="Wallet Address">
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
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();

const toast = useToast();

function copyAddress() {
  navigator.clipboard.writeText(userStore.address);
  toast.add({
    id: 'copy-address',
    title: "Copied address to clipboard"
  });
}
</script>
