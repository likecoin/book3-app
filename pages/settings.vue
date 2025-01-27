<template>
  <div class="flex flex-col items-stretch flex-grow">
    <AppPageHeader :title="$t('settings_page_header_title')" />

    <AppPageBody :ui="{ constrained: 'max-w-screen-md' }">
      <UFormGroup :label="$t('settings_page_account_label')">
        <UInput
          class="font-mono"
          :model-value="address"
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
              :disabled="!address"
              @click="copyAddress"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup :label="$t('settings_page_language_label')">
        <USelect v-model="locale" :options="localeOptions" />
      </UFormGroup>

      <UButton
        :label="$t('settings_page_sign_out_button_label')"
        variant="outline"
        size="xl"
        block
        @click="signOut"
      />
    </AppPageBody>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/user";

const userStore = useUserStore();

const { address } = storeToRefs(userStore);

const { $db } = useNuxtApp();
const router = useRouter();

const toast = useToast();

const i18n = useI18n();
const localeOptions = computed(() =>
  i18n.locales.value.map((locale) => ({
    label: locale.name,
    value: locale.code,
  })),
);
const switchLocalePath = useSwitchLocalePath();
const locale = computed({
  get: () => i18n.locale.value,
  set: (value) => {
    router.push(switchLocalePath(value));
  },
});

function copyAddress() {
  navigator.clipboard.writeText(address.value);
  toast.add({
    id: "copy-address",
    title: "Copied address to clipboard",
  });
}

async function signOut() {
  const isConfirmed = window.confirm(
    i18n.t("settings_page_sign_out_confirm_message"),
  );
  if (!isConfirmed) return;

  try {
    await userStore.logout();

    await Promise.all([
      $db.books.clear(),
      $db.bookCovers.clear(),
      $db.bookFiles.clear(),
    ]);
  } catch (error) {
    console.error(error);
  }
}
</script>
