import { defineStore } from 'pinia';
import { UserInfoResponse } from '../dto/Response/UserInfoResponse';
import { getDefaultAvatar , getDatiUser} from '../services/UserService';

export const useStoreUtente = defineStore('utente', {
  state: () => ({
    utente: {
      email: '',
      token: '',
      Info: new UserInfoResponse() // Assicurati che sia una classe valida o sostituiscila con un oggetto vuoto {}
    }
  }),
  getters: {
    isAutenticato: (state) => !!state.utente.token,
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
    }
  },
  persist: true // Abilita la persistenza dello stato
});
