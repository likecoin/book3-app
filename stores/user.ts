export const useUserStore = defineStore("userStore", () => {
  const isPrivyReady = ref(false);
  const isPrivyAuthenticated = ref(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const privyUser = ref<any>();
  const privyLogin = ref<() => Promise<void>>();
  const privyLogout = ref<() => Promise<void>>();

  const address = computed(() => privyUser.value?.wallet.address || "");

  function setIsPrivyReady(value: false) {
    isPrivyReady.value = value;
  }

  function setIsPrivyAuthenticated(value: boolean) {
    isPrivyAuthenticated.value = value;
  }

  function setPrivyLogin(value: () => Promise<void>) {
    privyLogin.value = value;
  }

  function setPrivyLogout(value: () => Promise<void>) {
    privyLogout.value = value;
  }

  function setPrivyUser(value: unknown) {
    privyUser.value = value;
  }

  function login() {
    privyLogin.value?.();
  }

  async function logout() {
    await privyLogout.value?.();
  }

  return {
    isPrivyReady,
    isPrivyAuthenticated,
    privyUser,
    privyLogin,
    privyLogout,

    address,

    setIsPrivyReady,
    setIsPrivyAuthenticated,
    setPrivyUser,
    setPrivyLogin,
    setPrivyLogout,

    login,
    logout,
  };
});
