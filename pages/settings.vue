<template>
  <div class="flex flex-col items-stretch flex-grow">
    <AppPageHeader title="Settings" /> 

    <AppPageBody :ui="{ constrained: 'max-w-screen-md' }">
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
    </AppPageBody>
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
