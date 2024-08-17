<template>
  <div class="flex flex-col">
    <AppHeaderBase class="w-full px-5">
      <AppLogo class="h-6" />
      <span class="font-mono font-bold">book3.app</span>
    </AppHeaderBase>

    <div class="flex flex-col gap-4 grow w-full p-5">
      <UVerticalNavigation class="grow" :links="menuLinks" />

      <UButton
        label="Settings"
        icon="i-heroicons-cog-8-tooth"
        variant="soft"
        size="sm"
        to="/settings"
        block
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const menuLinks = [
  {
    label: "Books",
    icon: "i-heroicons-book-open",
    to: "/",
  },
];
</script>
