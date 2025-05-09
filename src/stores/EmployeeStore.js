import { defineStore } from "pinia";
import { UserInfoResponse } from "../dto/Response/UserInfoResponse";
import { DatiImpiegatoResponse } from "../dto/Response/DatiImpiegato";
import { DatiAgenziaImmobiliareResponse } from "../dto/Response/DatiAgenziaImmobiliareResponse";
import {
  getDefaultAvatar,
  getDatiUser,
  getDatiImpiegato,
} from "../services/UserService";
import { getDatiAgenziaByEmailDipendente } from "../services/AgenziaImmobiliareService";

export const useEmployeeStore = defineStore("employee", {
  state: () => ({
    employee: {
      email: "",
      token: "",
      Info: new UserInfoResponse(),
      datiImpiegato: new DatiImpiegatoResponse(),
      DatiAgenziaImmobiliare: new DatiAgenziaImmobiliareResponse(),
    },
  }),
  getters: {
    isAutenticato: (state) => !!state.employee.token,
    datiUtente: (state) => state.employee.Info,
    UrlFotoProfilo: (state) => {
      return (
        state.employee.Info.UrlFotoProfilo ||
        getDefaultAvatar(state.employee.email)
      );
    },
    dipendenti: (state) => {
      return (
        state.employee.DatiAgenziaImmobiliare.dipendentiDettagli || new Map()
      );
    },
    ruolo: (state) => {
      return state.employee.datiImpiegato.ruolo || new DatiImpiegatoResponse();
    },
    infoUtente: (state) => {
      return state.employee.Info || new UserInfoResponse();
    },
  },
  actions: {
    impostaImpiegato(email, token) {
      this.employee.email = email;
      this.employee.token = token;
      this.aggiorna();
    },
    clear() {
      this.employee = {
        email: "",
        token: "",
        Info: new UserInfoResponse(),
        datiImpiegato: new DatiImpiegatoResponse(),
        DatiAgenziaImmobiliare: new DatiAgenziaImmobiliareResponse(),
      };
    },
    async aggiorna() {
      const email = this.employee.email;
      try {
        this.employee.Info = await getDatiUser(email);
      } catch (error) {
        console.warn("Errore aggiornamento info.", error);
        this.employee.Info.UrlFotoProfilo = getDefaultAvatar(
          this.employee.email,
        );
      }

      try {
        this.employee.datiImpiegato = await getDatiImpiegato(email);
      } catch (error) {
        console.warn("Errore aggiornamento dati impiegato", error);
      }

      try {
        const datiAgenzia = await getDatiAgenziaByEmailDipendente(email);
        this.employee.DatiAgenziaImmobiliare =
          new DatiAgenziaImmobiliareResponse(datiAgenzia);

        console.log(
          "Dipendenti email:",
          this.employee.DatiAgenziaImmobiliare.emailDipendenti,
        );

        for (const emailDipendente of this.employee.DatiAgenziaImmobiliare
          .emailDipendenti) {
          if (
            !this.employee.DatiAgenziaImmobiliare.dipendentiDettagli.has(
              emailDipendente,
            )
          ) {
            try {
              const [datiDipendente, datiImpiegato] = await Promise.all([
                getDatiUser(emailDipendente),
                getDatiImpiegato(emailDipendente),
              ]);

              this.employee.DatiAgenziaImmobiliare.dipendentiDettagli.set(
                emailDipendente,
                {
                  infoUtente: datiDipendente,
                  datiImpiegato: datiImpiegato,
                },
              );
            } catch (error) {
              console.warn(
                `Errore caricamento dati per dipendente ${emailDipendente}`,
                error,
              );
            }
          }
        }
      } catch (error) {
        console.warn("Errore aggiornamento dati agenzia", error);
      }
    },
  },
  persist: true,
});
