<template>
  <div class="flex flex-col">
    <AppHeaderBase class="w-full px-5">
      <AppLogo class="h-6" />
      <span class="font-mono font-bold">book3.app</span>
    </AppHeaderBase>

    <div class="flex flex-col gap-4 grow w-full p-5">
      <UVerticalNavigation class="grow" :links="menuLinks" />

      <UButton
        :label="$t('menu_item_settings')"
        icon="i-heroicons-cog-8-tooth"
        variant="soft"
        size="sm"
        :to="localePath({ name: 'settings' })"
        block
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t: $t } = useI18n();
const localePath = useLocalePath();

const menuLinks = computed(() => [
  {
    label: $t("menu_item_books"),
    icon: "i-heroicons-book-open",
    to: localePath({ name: "index" }),
  },
]);
</script>
