import { defineStore } from 'pinia';
import { UserInfoResponse } from '../dto/Response/UserInfoResponse';
import { DatiImpiegatoResponse } from '../dto/Response/DatiImpiegato';
import { DatiAgenziaImmobiliareResponse } from '../dto/Response/DatiAgenziaImmobiliareResponse';
import { getDefaultAvatar, getDatiUser, getDatiImpiegato } from '../services/UserService';
import AgenziaImmobiliareService from '../services/AgenziaImmobiliareService';

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employee: {
      email: "",
      token: "",
      Info: new UserInfoResponse(),
      datiImpiegato: new DatiImpiegatoResponse(),
      DatiAgenziaImmobiliare: new DatiAgenziaImmobiliareResponse()

    }
  }),
  getters: {
    isAutenticato: (state) => !!state.employee.token,
    datiUtente: (state) => state.employee.Info,
    UrlFotoProfilo: (state) => {
      // Controlla se l'URL della foto del profilo è disponibile
      return state.employee.Info.UrlFotoProfilo || getDefaultAvatar(state.employee.email);
    },
    dipedenti: (state) => {

      return state.employee.DatiAgenziaImmobiliare.dipendenti || []; 
    }
  },
  actions: {
    impostaImpiegato(email, token) {
      this.employee.email = email;
      this.employee.token = token;
      this.aggiorna();
    },
    clear() {
      this.employee = {
        email: '',
        token: '',
        Info: new UserInfoResponse(),
        datiImpiegato: new DatiImpiegatoResponse(),
        DatiAgenziaImmobiliare: new DatiAgenziaImmobiliareResponse()
      };
    },
    aggiorna() {
      const email = this.employee.email;
      getDatiUser(email)
        .then((userInfo) => {
          this.employee.Info = userInfo;
        })
        .catch((error) => {
          console.warn("Attenzione: si è verificato un errore durante l'aggiornamento delle info.", error);
          this.employee.Info.UrlFotoProfilo = getDefaultAvatar(this.employee.email);
        });
      getDatiImpiegato(email)
        .then((dati) => {
          console.log("get dati impiegato: ", dati);
          this.employee.datiImpiegato = dati;
        })
        .catch((error) => {
          console.warn("Attenzione: si è verificato un errore durante l'aggiornamento dei dati impiegato", error);
        });
      AgenziaImmobiliareService.getDatiAgenziaByEmailDipendente(email)
        .then((dati) => {
          this.employee.DatiAgenziaImmobiliare = dati;
        })
        .catch((error) => {
          console.warn("Attenzione: si è verificato un errore durante l'aggiornamento dei dati riferti alla agenzia", error);
        });


    }
  },
  persist: true // Abilita la persistenza dello stato
});
