export class Contatto {
    constructor(data = {}) {
        this.id=data.id || 0
        this.tipo = data.tipo || ""; 
        this.valore = data.valore || "";
    }
}

export class DatiImpiegatoResponse {
    constructor(data = {}) {
        this.email = data.email || "";
        this.nome = data.nome || "";
        this.cognome = data.cognome || "";
        this.contatti = (data.contatti || []).map(contatto => new Contatto(contatto));
        this.ruolo = data.ruolo || "";
    }
}