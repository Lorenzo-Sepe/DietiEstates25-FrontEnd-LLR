export class DatiAgenziaImmobiliareResponse {
    constructor(data = {}) {
        this.nomeAzienda = data.nomeAzienda || "";
        this.ragioneSociale = data.ragioneSociale || "";
        this.partitaIva = data.partitaIva || "";
        this.fondatore = data.fondatore || "";
        this.dipendenti = new Set(data.dipendenti || []); // Utilizza un Set per i dipendenti
    }
}