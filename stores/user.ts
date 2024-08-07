import { defineStore } from "pinia";
import type { SignableMessage } from "viem";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    address: '',
  }),
  actions: {
    async fetchSettings() {
      const data: { address: string } = await $fetch("/api/users/settings");

      this.address = data?.address;
    },
    async login({
      address,
      message,
      signature
    }: {
      address: `0x${string}`,
      message: SignableMessage,
      signature: `0x${string}`
    }) {
      const data: { address: string } = await $fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, message, signature }),
      });
      this.address = data.address;
    },
    async logout() {
      this.address = '';
      await $fetch("/api/users/logout", { method: "POST" });
    }
  }
})
