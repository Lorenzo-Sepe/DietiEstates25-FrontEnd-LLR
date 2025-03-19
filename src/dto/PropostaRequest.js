export class PropostaRequest{

    constructor(data = {}) {

        this.annuncioId = data.annuncioId || null;
        this.nome = data.nome || '';
        this.cognome = data.cognome || '';
        this.prezzo = data.prezzo || '';
        this.tipoContatto = data.tipoContatto || '';
        this.informazioniContatto = data.informazioniContatto || ''; 
    
    }
    
}