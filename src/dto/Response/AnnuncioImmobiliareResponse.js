import { date } from "@primeuix/themes/aura/datepicker";

export class Contatto {
  constructor(data = {}) {
    this.tipo = data.tipo || "";
    this.valore = data.valore || "";
  }
}

export class DatiProponente {
  constructor(data = {}) {
    this.email = data.email || "";
    this.nome = data.nome || "";
    this.cognome = data.cognome || "";
    this.contatto = new Contatto(data.contatto);
  }
}

export class Proposta {
  constructor(data = {}) {
    this.idProposta = data.idProposta || 0;
    this.prezzoProposta = data.prezzoProposta || 0;
    this.controproposta = data.controproposta || 0;
    this.stato = data.stato || "";
    this.datiProponente = new DatiProponente(data.datiProponente);
  }
}

export class Agente {
  constructor(data = {}) {
    this.email = data.email || "";
    this.username = data.username || "";
    this.urlFotoProfilo = data.urlFotoProfilo || "";
    this.nome = data.nome || "";
    this.cognome = data.cognome || "";
    this.contatti = data.contatti || [];
  }
}

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
    this.vicinoA = data.vicinoA || [];
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
    this.descrizioneAggiuntiva = data.descrizioneAggiuntiva || "";
  }
}

export class Immagine {
  constructor(data = {}) {
    this.url = data.url || "";
    this.descrizione = data.descrizione || "";
  }
}

export class Immobile {
  constructor(data = {}) {
    this.tipologiaImmobile = data.tipologiaImmobile || "";
    this.metriQuadri = data.metriQuadri || 0;
    this.classeEnergetica = data.classeEnergetica || "";
    this.numeroServizi = data.numeroServizi || 0;
    this.numeroStanze = data.numeroStanze || 0;
    this.numeroDiPiani = data.numeroDiPiani || 0;
    this.indirizzo = new Indirizzo(data.indirizzo);
    this.caratteristicheAggiuntive = new CaratteristicheAggiuntive(
      data.caratteristicheAggiuntive,
    );
    this.immagini = (data.immagini || []).map((img) => new Immagine(img));
  }
}

export class ContrattoVenditaResponse {
  constructor(data = {}) {
    this.prezzoVendita = data.prezzoVendita || 0;
    this.mutuoEstinto = data.mutuoEstinto || false;
  }
}

export class ContrattoAffittoResponse {
  constructor(data = {}) {
    this.prezzoAffitto = data.prezzoAffitto || 0;
    this.tempoMinimo = data.tempoMinimo || 0;
    this.tempoMassimo = data.tempoMassimo || 0;
    this.caparra = data.caparra || 0;
  }
}

export class Contratto {
  constructor(data = {}) {
    this.tipoContratto = data.tipoContratto || "";
    if (data.tipoContratto === "VENDITA") {
      this.contrattoVenditaResponse = new ContrattoVenditaResponse(
        data.contrattoVenditaResponse,
      );
    } else {
      this.contrattoAffittoResponse = new ContrattoAffittoResponse(
        data.contrattoAffittoResponse,
      );
    }
  }
}

export class AnnuncioImmobiliareResponse {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.dataPubblicazione = data.dataPubblicazione || null;
    this.titolo = data.titolo || "";
    this.descrizione = data.descrizione || "";
    this.agente = new Agente(data.agente);
    this.immobile = new Immobile(data.immobile);
    this.contratto = new Contratto(data.contratto);
    this.proposte = (data.proposte || []).map(
      (proposta) => new Proposta(proposta),
    );
  }
}
