import { defineStore } from 'pinia';
import { UserInfoResponse } from '../dto/Response/UserInfoResponse';
import { getDefaultAvatar , getDatiUser} from '../services/UserService';

import { jwtDecode } from 'jwt-decode'

export const useStoreUtente = defineStore('utente', {
  state: () => ({
    utente: {
      email: '',
      token: '',
      Info: new UserInfoResponse()
    }
  }),
  getters: {
    isAutenticato: (state) => {
      try {
        return !state.isTokenScaduto();
      } catch (error) {
        console.error("Errore durante la verifica dell'autenticazione:", error);
        return false; // Restituisce false in caso di errore
      }
    },
    datiUtente: (state) => state.utente.Info,
    UrlFotoProfilo: (state) => {
      // Controlla se l'URL della foto del profilo è disponibile
      return state.utente.Info.UrlFotoProfilo || getDefaultAvatar(state.utente.email);
    }
    },
  actions: {
    impostaUtente(email, token) {
      this.utente.email = email;
      this.utente.token = token;
      this.aggiorna();
    },
    clear() {
      this.utente = {
        email: '',
        token: '',
        Info: new UserInfoResponse()
      };
    },
    aggiorna() {
      const email = this.utente.email;
      getDatiUser(email)
        .then((userInfo) => {
          console.log("aggiorno dari per user comune: ",userInfo);
          this.utente.Info = userInfo;
        })
        .catch((error) => {
          console.warn("Attenzione: si è verificato un errore durante l'aggiornamento dei dati dell'utente.", error);
          this.utente.Info.UrlFotoProfilo = getDefaultAvatar(this.utente.email);
        });
    },

    isTokenScaduto() {

      const token = this.utente.token;

      try {
        const decoded = jwtDecode(token)
        const now = Date.now().valueOf() / 1000 // tempo in secondi
        return decoded.exp < now
      } catch (error) {
        console.error("Errore durante la decodifica del token:", error);
        return true // token malformato, considerato non valido
      }
    }
  },
  persist: true // Abilita la persistenza dello stato
});
