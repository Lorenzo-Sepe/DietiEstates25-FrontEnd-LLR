import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      id: null,
      username: '',
      urlFotoProfilo: '',
      email: '',
      token: '',
      authority:'',
      isAuthenticated: false
    }
  }),

  getters: {
    isLoggedIn: (state) => state.user.isAuthenticated,
    getUserData: (state) => state.user
  },

  actions: {
    initializeStore() {
      // Recupera i dati dal localStorage all'avvio
      const savedState = localStorage.getItem('user-store')
      if (savedState) {
        this.$patch(JSON.parse(savedState))
      }
    },

    setUser(userData) {
      this.user = {
        ...this.user,
        ...userData,
        isAuthenticated: true
      }
      // Salva nel localStorage
      this.saveToLocalStorage()
    },

    clearUser() {
      this.user = {
        id: null,
        name: '',
        email: '',
        isAuthenticated: false
      }
      // Rimuovi dal localStorage
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      localStorage.setItem('user-store', JSON.stringify(this.$state))
    }
  }
})
