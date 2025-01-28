<template>
  <div class="flex flex-col items-stretch flex-grow">
    <AppPageHeader :title="$t('settings_page_header_title')" />

    <AppPageBody :ui="{ constrained: 'max-w-screen-md' }">
      <UFormGroup :label="$t('settings_page_account_label')">
        <UInput
          class="font-mono"
          :model-value="accountInfo.address || 'N/A'"
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
              :disabled="!accountInfo.address"
              @click="copyAddress"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UButton
        :label="$t('settings_page_appkit_button_label')"
        variant="outline"
        size="xl"
        block
        :disabled="isAppKitModalOpen"
        :loading="isAppKitModalOpen"
        @click="handleAppKitButtonClick"
      />

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
import {
  useAppKit,
  useAppKitAccount,
  useAppKitState,
  useDisconnect,
} from "@reown/appkit/vue";

const { open: openAppKit } = useAppKit();
const { open: isAppKitModalOpen } = useAppKitState();
const accountInfo = useAppKitAccount();

const { disconnect } = useDisconnect();

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

function handleAppKitButtonClick() {
  if (isAppKitModalOpen) return;
  openAppKit({ view: "Account" });
}

function copyAddress() {
  navigator.clipboard.writeText(accountInfo.value.address || "");
  toast.add({
    id: "copy-address",
    title: "Copied address to clipboard",
  });
}

async function signOut() {
  if (accountInfo.value.status !== "connected") return;

  const isConfirmed = window.confirm(
    i18n.t("settings_page_sign_out_confirm_message"),
  );
  if (!isConfirmed) return;

  disconnect();
}
</script>
