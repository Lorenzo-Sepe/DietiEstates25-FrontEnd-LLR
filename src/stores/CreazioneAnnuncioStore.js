import { defineStore } from "pinia";
import { AnnuncioImmobiliareRequest } from "../dto/RequestAnnuncio";

export const useStoreAnnuncio = defineStore("annuncio", {
  state: () => ({
    annuncio: new AnnuncioImmobiliareRequest(),
  }),

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
