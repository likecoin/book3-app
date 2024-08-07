<template>
  <div class="flex flex-col items-stretch flex-grow">
    <PageHeader title="Settings" /> 

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
