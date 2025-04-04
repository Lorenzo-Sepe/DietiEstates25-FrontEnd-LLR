import { UserInfoResponse } from "./UserInfoResponse";
import { DatiImpiegatoResponse } from './DatiImpiegato';

export class DatiAgenziaImmobiliareResponse {
    constructor(data = {}) {
        this.nomeAzienda = data.nomeAzienda || "";
        this.ragioneSociale = data.ragioneSociale || "";
        this.partitaIva = data.partitaIva || "";
        this.fondatore = data.fondatore || "";
        this.emailDipendenti = new Set(data.emailDipendenti || []); // Solo email

        // Mappa che associa un'email ai dettagli del dipendente 
        // (composta da UserInfoResponse e DatiImpiegatoResponse)
        this.dipendentiDettagli = new Map();

        // Se vengono passati dati iniziali, popola la mappa con gli oggetti corretti
        if (data.dipendentiDettagli) {
            for (const [email, dettagli] of Object.entries(data.dipendentiDettagli)) {
                this.dipendentiDettagli.set(email, {
                    infoUtente: new UserInfoResponse(dettagli.infoUtente),
                    datiImpiegato: new DatiImpiegatoResponse(dettagli.datiImpiegato)
                });
            }
        }
    }
}
