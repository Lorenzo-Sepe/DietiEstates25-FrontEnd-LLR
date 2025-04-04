export class DatiAgenziaImmobiliareResponse {
    constructor(data = {}) {
        this.nomeAzienda = data.nomeAzienda || "";
        this.ragioneSociale = data.ragioneSociale || "";
        this.partitaIva = data.partitaIva || "";
        this.fondatore = data.fondatore || "";
        this.emailDipendenti = new Set(data.emailDipendenti || []); // Solo email
        this.dipendentiDettagli = new Map(); // Cache dettagli dipendenti
    }
}