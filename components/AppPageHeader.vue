<template>
  <AppHeaderBase class="justify-between w-full px-5">
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
  </AppHeaderBase>
</template>

<script setup lang="ts">
const uiStore = useUIStore();

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  isShowMenuToggle: {
    type: Boolean,
    default: true,
  },
});
</script>
