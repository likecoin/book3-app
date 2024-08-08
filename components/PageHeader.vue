<template>
  <UContainer
    as="header"
    :ui="{
      base: 'sticky top-0 flex justify-between items-center gap-4 w-full min-h-[64px] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800',
      constrained: ''
    }"
  >
    <div class="flex items-center gap-2">
      <UButton
        v-if="isShowMenuToggle"
        class="lg:hidden"
        icon="i-heroicons-bars-3"
        size="lg"
        variant="ghost"
        @click="uiStore.setIsMobileMenuOpen(true)"
      />

      <h1 class="font-bold text-xl">{{ props.title }}</h1>
    </div>

    <slot name="trailing" />
  </UContainer>
</template>

<script setup lang="ts">
const uiStore = useUIStore();

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  isShowMenuToggle: {
    type: Boolean,
    default: true,
  },
});
</script>
