class PropostaRequest{
    annuncioId;
    nome;
    cognome;
    prezzo;
    TipoContratto;
    informazioniContratto;

    static TipoContrattoEnum = {
        TELEFONO: 'TELEFONO',
        EMAIL: 'EMAIL',
        MESSAGGIO: 'MESSAGGIO'
    };

    static builder() {
        return new PropostaRequestBuilder();
    }
}

class PropostaRequestBuilder {
    constructor() {
        this.propostaRequest = new PropostaRequest();
    }

    setAnnuncioId(annuncioId) {
        this.propostaRequest.annuncioId = annuncioId;
        return this;
    }

    setNome(nome) {
        this.propostaRequest.nome = nome;
        return this;
    }

    setCognome(cognome) {
        this.propostaRequest.cognome = cognome;
        return this;
    }

    setPrezzo(prezzo) {
        this.propostaRequest.prezzo = prezzo;
        return this;
    }

    setTipoContratto(tipoContratto) {
        if (!Object.values(PropostaRequest.TipoContrattoEnum).includes(tipoContratto)) {
            throw new Error('TipoContratto non valido');
        }
        this.propostaRequest.TipoContratto = tipoContratto;
        return this;
    }

    setInformazioniContratto(informazioniContratto) {
        this.propostaRequest.informazioniContratto = informazioniContratto;
        return this;
    }

    build() {
        return this.propostaRequest;
    }
}