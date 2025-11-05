import { defineStore } from "pinia";
import { UserInfoResponse } from "../dto/Response/UserInfoResponse";
import { getDefaultAvatar, getDatiUser } from "../services/UserService";
import { jwtDecode } from "jwt-decode";

function isTokenScaduto(token) {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (error) {
    console.error("Errore durante la decodifica del token:", error);
    return true;
  }
}

export const useStoreUtente = defineStore("utente", {
  state: () => ({
    utente: {
      email: "",
      token: "",
      Info: new UserInfoResponse(),
    },
  }),
  getters: {
    
    getNomeVisulizzato: (state) => {

      // Controlla se il nome visualizzato è disponibile
      if (state.utente.Info.nomeVisualizzato) {
        return state.utente.Info.nomeVisualizzato;
      } else {
        //return email without domain
        const emailParts = state.utente.email.split("@");
        return emailParts[0];
      }
    },

    isAutenticato: (state) => {
      try {
        return !isTokenScaduto(state.utente.token);
      } catch (error) {
        console.error("Errore durante la verifica dell'autenticazione:", error);
        return false; // Restituisce false in caso di errore
      }
    },
    getEmail: (state) => state.utente.email,
    datiUtente: (state) => state.utente.Info,
    UrlFotoProfilo: (state) => {
      // Controlla se l'URL della foto del profilo è disponibile
      return (
        state.utente.Info.urlFotoProfilo || getDefaultAvatar(state.utente.email)
      );
    },
  },
  actions: {
    impostaUtente(email, token) {
      this.utente.email = email;
      this.utente.token = token;
      this.aggiorna();
    },
    async logout() {
      // Ritardo fittizio per miglior UX (opzionale)
      await new Promise((resolve) => setTimeout(resolve, 800));

      this.clear(); // resetta stato
    },
    clear() {
      this.utente = {
        email: "",
        token: "",
        Info: new UserInfoResponse(),
      };
    },
    aggiorna() {
      const email = this.utente.email;
      getDatiUser(email)
        .then((userInfo) => {
          this.utente.Info = userInfo;
        })
        .catch((error) => {
          console.warn(
            "Attenzione: si è verificato un errore durante l'aggiornamento dei dati dell'utente.",
            error,
          );
          this.utente.Info.urlFotoProfilo = getDefaultAvatar(this.utente.email);
        });
    },
  },
  persist: true, // Abilita la persistenza dello stato
});
