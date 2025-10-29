import { defineStore } from "pinia";
import { AnnuncioImmobiliareRequest } from "../dto/RequestAnnuncio";

export const useStoreAnnuncio = defineStore("annuncio", {
  state: () => ({
    annuncio: new AnnuncioImmobiliareRequest(),
  }),

    actions: {
    // 🔹 Funzione per resettare i dati
    resetAnnuncio() {
      this.annuncio = new AnnuncioImmobiliareRequest();
    },
  },

   getters: {
    // 🔹 Verifica se l'annuncio è “vuoto”
    isAnnuncioVuoto: (state) => {
      const annuncioBase = new AnnuncioImmobiliareRequest();
      return JSON.stringify(state.annuncio) === JSON.stringify(annuncioBase);
    },
  },

  persist: {
    enabled: true, // Abilita la persistenza
    strategies: [
      {
        key: "annuncio", // Chiave usata nel localStorage/sessionStorage
        storage: localStorage, // Puoi usare anche sessionStorage
      },
    ],
  },
});
