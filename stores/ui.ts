export const useUIStore = defineStore("uiStore", {
  state: () => ({
    isMobileMenuOpen: false,
  }),
  actions: {
    setIsMobileMenuOpen(value: boolean) {
      this.isMobileMenuOpen = value;
    },
  },
});
