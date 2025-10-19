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
    getNomeVisualizzato: (state) => {
      if (state.employee.Info.nomeVisualizzato) {
        return state.employee.Info.nomeVisualizzato;
      } else if (state.employee.Info.Nome) {
        return state.employee.Info.Cognome
          ? `${state.employee.Info.Nome} ${state.employee.Info.Cognome}`
          : state.employee.Info.Nome;
      } else {
        const emailParts = state.employee.email.split("@");
        return emailParts[0];
      }
    },
    getNomeAzienda: (state) => {
      if (state.employee.DatiAgenziaImmobiliare.nomeAzienda) {
        return state.employee.DatiAgenziaImmobiliare.nomeAzienda;
      } else {
        const emailParts = state.employee.email.split("@");
        const domainParts = emailParts[1].split(".");
        return domainParts[0];
      }
    },

    isAutenticato: (state) => {
      try {
        return !isTokenScaduto(state.employee.token);
      } catch (error) {
        console.error("Errore durante la verifica dell'autenticazione:", error);
        return false;
      }
    },
    getEmail: (state) => state.employee.email,
    datiUtente: (state) => state.employee.Info,
    UrlFotoProfilo: (state) =>
      state.employee.Info.urlFotoProfilo ||
      getDefaultAvatar(state.employee.email),
    dipendenti: (state) =>
      state.employee.DatiAgenziaImmobiliare.dipendentiDettagli || new Map(),
    ruolo: (state) =>
      state.employee.datiImpiegato.ruolo || new DatiImpiegatoResponse(),
    infoUtente: (state) => state.employee.Info || new UserInfoResponse(),
    getContatti: (state) => state.employee.datiImpiegato.contatti || [],
  },
  actions: {
    impostaImpiegato(email, token) {
      this.employee.email = email;
      this.employee.token = token;
      this.aggiorna();
    },
    async logout() {
      await new Promise((resolve) => setTimeout(resolve, 800));
      this.clear();
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
