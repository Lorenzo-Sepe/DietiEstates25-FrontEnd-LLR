import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", {
  state: () => ({
    showLoginModal: false,
    loginRedirect: null,
    loginReason: null,
    loginRole: null, // "user" o "employee"
    fromPath: null, // Pagina di provenienza
    toPath: null,   // Pagina di destinazione
  }),
  actions: {
    reset() {
      this.showLoginModal = false;
      this.loginRedirect = null;
      this.loginReason = null;
      this.loginRole = null;
      this.fromPath = null;
      this.toPath = null;
    }
  }
});
export default useUIStore;