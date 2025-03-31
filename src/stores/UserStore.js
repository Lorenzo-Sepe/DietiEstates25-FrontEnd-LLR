import { defineStore } from 'pinia';

// Store per utenti normali
export const useStoreUtente = defineStore('utente', {
  state: () => ({
    utente: {
      email:"",
      token:"",
      UrlFotoProfilo:"",
      nomeVisualizzato:"",
      authority:""
    }
  }),
  persist: {
    enabled: true,
    strategies: [{
      key: 'utente',
      storage: localStorage
    }]
  }
});