export class FiltroAnnuncioRequest{

    constructor(data = {}) {

        this.numeroPagina = data.numeroPagina || 0;
        this.numeroDiElementiPerPagina = data.numeroDiElementiPerPagina || 5;
        this.titolo = data.titolo || null;
        this.tipologiaImmobile = data.tipologiaImmobile || null;
        this.tipologiaContratto = data.tipologiaContratto || null;
        this.prezzoMin = data.prezzoMin || null;
        this.prezzoMax = data.prezzoMax || null;
        this.metriQuadriMin = data.metriQuadriMin || null;
        this.metriQuadriMax = data.metriQuadriMax || null;
        this.provincia = data.provincia || null;
        this.latCentro = data.latCentro || null;
        this.lonCentro = data.lonCentro || null;
        this.raggioKm = data.raggioKm || null;
        this.balconi = data.balconi || null;
        this.garage = data.garage || null;
        this.pannelliSolari = data.pannelliSolari || null; 
    
    }
    
}