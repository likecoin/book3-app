import type { SignableMessage } from "viem";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    address: "",
  }),
  actions: {
    async fetchSettings() {
      // NOTE: Pass the headers in SSR for authentication
      const headers = useRequestHeaders();
      const data = await $fetch<{ address: string }>("/api/users/settings", {
        headers,
      }).catch((error) => {
        if (typeof error.data === "string") throw new Error(error.data);
        throw error;
      });

      this.address = data?.address;
    },
    async login({
      address,
      message,
      signature,
    }: {
      address: `0x${string}`;
      message: SignableMessage;
      signature: `0x${string}`;
    }) {
      const data = await $fetch<{ address: string }>("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, message, signature }),
      }).catch((error) => {
        if (typeof error.data === "string") throw new Error(error.data);
        throw error;
      });
      this.address = data.address;
    },
    async logout() {
      this.address = "";
      await $fetch("/api/users/logout", { method: "POST" });
    },
  },
});
