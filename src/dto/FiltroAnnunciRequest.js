export class FiltroAnnunciRequest{
    
    numeroPagina;
    numeroDiElementiPerPagina;
    titolo;
    tipologiaImmobile;
    tipologiaContratto;
    prezzoMin;
    prezzoMax;
    metriQuadriMin;
    metriQuadriMax;
    provincia;
    latCentro;
    lonCentro;
    raggioKm;
    balconi;
    garage;
    pannelliSolari;

    static TipoContrattoEnum = {
        AFFITTO: 'AFFITTO',
        VENDITA: 'VENDITA'
    };

    static builder() {

        return new FiltroAnnunciRequestBuilder();
    }
}

class FiltroAnnunciRequestBuilder {

    constructor() {

        this.filtroAnnunciRequest = new FiltroAnnunciRequest();
    }

    setNumeroPagina(numeroPagina) {

        this.filtroAnnunciRequest.numeroPagina = numeroPagina;

        return this;
    }

    setNumeroDiElementiPerPagina(numeroDiElementiPerPagina) {

        this.filtroAnnunciRequest.numeroDiElementiPerPagina = numeroDiElementiPerPagina;

        return this;
    }

    build() {
        return this.filtroAnnunciRequest;
    }
}