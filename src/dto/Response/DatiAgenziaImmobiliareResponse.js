import { UserInfoResponse } from "./UserInfoResponse";
import { DatiImpiegatoResponse } from "./DatiImpiegato";

export function DatiAgenziaImmobiliareResponse(data = {}) {
  const response = {
    nomeAzienda: data.nomeAzienda || "",
    ragioneSociale: data.ragioneSociale || "",
    partitaIva: data.partitaIva || "",
    fondatore: data.fondatore || "",
    emailDipendenti: new Set(data.emailDipendenti || []), // Solo email
    dipendentiDettagli: new Map(),
  };

  // Se vengono passati dati iniziali, popola la mappa con gli oggetti corretti
  if (data.dipendentiDettagli) {
    for (const [email, dettagli] of Object.entries(data.dipendentiDettagli)) {
      response.dipendentiDettagli.set(email, {
        infoUtente: new UserInfoResponse(dettagli.infoUtente),
        datiImpiegato: new DatiImpiegatoResponse(dettagli.datiImpiegato),
      });
    }
  }

  return response;
}
