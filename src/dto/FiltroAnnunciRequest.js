export class FiltroAnnuncioRequest {
  constructor(data = {}) {
    //Pagina
    this.numeroPagina = data.numeroPagina || 1;
    this.numeroDiElementiPerPagina = data.numeroDiElementiPerPagina || 5;

    //Immobile
    this.titolo = data.titolo || null;
    this.tipologiaImmobile = data.tipologiaImmobile || null;
    this.tipologiaContratto = data.tipologiaContratto || null;
    this.prezzoMin = data.prezzoMin || null;
    this.prezzoMax = data.prezzoMax || null;
    this.metriQuadriMin = data.metriQuadriMin || null;
    this.metriQuadriMax = data.metriQuadriMax || null;
    
    //Localizzazione
    this.provincia = data.provincia || null;
    this.latCentro = data.latCentro || null;
    this.lonCentro = data.lonCentro || null;
    this.raggioKm = data.raggioKm || null;

    //Caratteristiche aggiuntive
    this.balconi = data.balconi || null;
    this.garage = data.garage || null;
    this.postiAuto = data.postiAuto || null;
    this.giardino = data.giardino || null;
    this.ascensore = data.ascensore || null;
    this.portiere = data.portiere || null;
    this.riscaldamentoCentralizzato = data.riscaldamentoCentralizzato || null;
    this.climatizzatori = data.climatizzatori || null;
    this.pannelliSolari = data.pannelliSolari || null;
    this.cantina = data.cantina || null;
    this.soffitta = data.soffitta || null;
    this.descrizioneAggiuntiva = data.descrizioneAggiuntiva || null;

    //Dati staff
    this.agenteCreatoreAnnuncio = data.agenteCreatoreAnnuncio || "";

    //Criteri di ordinazione
    this.ordinePrezzoAsc = data.ordinePrezzoAsc || false;
    this.ordinePrezzoDesc = data.ordinePrezzoDesc || false;
    this.ordineDataAsc = data.ordineDataAsc || false;
    this.ordineDataDesc = data.ordineDataDesc || false;
  }
}
