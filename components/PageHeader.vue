<template>
  <UContainer
    as="header"
    :ui="{
      base: 'flex justify-between items-center gap-4 w-full min-h-[64px] border-b border-gray-200 dark:border-gray-800',
      constrained: ''
    }"
  >
    <h1 class="font-bold text-xl">{{ props.title }}</h1>

    <slot name="trailing" />
  </UContainer>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});
</script>
