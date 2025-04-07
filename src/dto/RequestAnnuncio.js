export class Indirizzo {
    constructor(data = {}) {
      this.via = data.via || "";
      this.numeroCivico = data.numeroCivico || "";
      this.citta = data.citta || "";
      this.cap = data.cap || "";
      this.provincia = data.provincia || "";
      this.nazione = data.nazione || "";
      this.latitudine = data.latitudine || 0;
      this.longitudine = data.longitudine || 0;
    }
  }
  
  export class CaratteristicheAggiuntive {
    constructor(data = {}) {
      this.balconi = data.balconi || false;
      this.garage = data.garage || false;
      this.postiAuto = data.postiAuto || false;
      this.giardino = data.giardino || false;
      this.ascensore = data.ascensore || false;
      this.portiere = data.portiere || false;
      this.riscaldamentoCentralizzato = data.riscaldamentoCentralizzato || false;
      this.climatizzatori = data.climatizzatori || false;
      this.pannelliSolari = data.pannelliSolari || false;
      this.cantina = data.cantina || false;
      this.soffitta = data.soffitta || false;
      this.descrizioneAggiuntiva = data.descrizioneAggiuntiva || ""
    }
  }
  
  export class Immagine {
    constructor(data = {}) {
      this.file = data.file || "";
      this.descrizione = data.descrizione || "";
      this.urlImmagineEsistente = data.urlImmagineEsistente || "";
      this.loading=data.loading || false;
    }
  }
  
  export class Immobile {
    constructor(data = {}) {
      this.tipologiaImmobile = data.tipologiaImmobile || "";
      this.metriQuadri = data.metriQuadri || 0;
      this.numeroDiPiani = data.numeroDiPiani || 0;
      this.numeroStanze = data.numeroStanze || 0;
      this.numeroServizi = data.numeroServizi || 0;
      this.classeEnergetica = data.classeEnergetica || "";
      this.indirizzo = new Indirizzo(data.indirizzo);
      this.caratteristicheAggiuntive = new CaratteristicheAggiuntive(data.caratteristicheAggiuntive);
      this.immagini = (data.immagini || []).map(img => new Immagine(img));
    }
  }
  
  export class DatiAffitto {
    constructor(data = {}) {
        this.tempoMinimo = data.tempoMinimo || 0; 
        this.tempoMassimo = data.tempoMassimo || 0; 
        this.prezzo = data.prezzo !== undefined ? data.prezzo : null; 
        this.caparra = data.caparra !== undefined ? data.caparra : null; 
    }
}
  
  export class DatiVendita {
    constructor(data = {}) {
      this.prezzo = data.prezzo || 0;
      this.mutuoEstinto = data.mutuoEstinto || false;
    }
  }
  
  export class Contratto {
    constructor(data = {}) {
      this.tipoDiContratto = data.tipoDiContratto || "";
      this.datiAffittoRequest = new DatiAffitto(data.datiAffittoRequest);
      this.datiVenditaRequest = new DatiVendita(data.datiVenditaRequest);
    }
  }
  
  export class AnnuncioImmobiliareRequest {
    constructor(data = {}) { 
      this.titolo = data.titolo || "";
      this.descrizione = data.descrizione || "";
      this.immobile = new Immobile(data.immobile);
      this.contratto = new Contratto(data.contratto);
    }
  }
  