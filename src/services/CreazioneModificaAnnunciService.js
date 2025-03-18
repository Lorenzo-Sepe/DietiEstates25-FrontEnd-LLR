import { ApiAgent } from "../api/axiosConfig";
import { AnnuncioImmobiliareRequest } from "../dto/RequestAnnuncio";
export function CreaAnnuncio(oggettoAnnuncio) {
    const annuncio = new AnnuncioImmobiliareRequest(oggettoAnnuncio);

// Creazione di un oggetto FormData
const formData = new FormData();

// Aggiunta dei dati all'oggetto FormData
formData.append('titolo', annuncio.titolo);
formData.append('descrizione', annuncio.descrizione);

// Immobile
formData.append('immobile.tipologiaImmobile', annuncio.immobile.tipologiaImmobile);
formData.append('immobile.metriQuadri', annuncio.immobile.metriQuadri);
formData.append('immobile.numeroDiPiani', annuncio.immobile.numeroDiPiani);
formData.append('immobile.numeroStanze', annuncio.immobile.numeroStanze);
formData.append('immobile.numeroServizi', annuncio.immobile.numeroServizi);
formData.append('immobile.classeEnergetica', annuncio.immobile.classeEnergetica);

// Indirizzo
formData.append('immobile.indirizzo.via', annuncio.immobile.indirizzo.via);
formData.append('immobile.indirizzo.numeroCivico', annuncio.immobile.indirizzo.numeroCivico);
formData.append('immobile.indirizzo.citta', annuncio.immobile.indirizzo.citta);
formData.append('immobile.indirizzo.cap', annuncio.immobile.indirizzo.cap);
formData.append('immobile.indirizzo.provincia', annuncio.immobile.indirizzo.provincia);
formData.append('immobile.indirizzo.nazione', 'Italia');
formData.append('immobile.indirizzo.latitudine', annuncio.immobile.indirizzo.latitudine);
formData.append('immobile.indirizzo.longitudine', annuncio.immobile.indirizzo.longitudine);

// Caratteristiche Aggiuntive
formData.append('immobile.caratteristicheAggiuntive.balconi', annuncio.immobile.caratteristicheAggiuntive.balconi);
formData.append('immobile.caratteristicheAggiuntive.garage', annuncio.immobile.caratteristicheAggiuntive.garage);
formData.append('immobile.caratteristicheAggiuntive.postiAuto', annuncio.immobile.caratteristicheAggiuntive.postiAuto);
formData.append('immobile.caratteristicheAggiuntive.giardino', annuncio.immobile.caratteristicheAggiuntive.giardino);
formData.append('immobile.caratteristicheAggiuntive.ascensore', annuncio.immobile.caratteristicheAggiuntive.ascensore);
formData.append('immobile.caratteristicheAggiuntive.portiere', annuncio.immobile.caratteristicheAggiuntive.portiere);
formData.append('immobile.caratteristicheAggiuntive.riscaldamentoCentralizzato', annuncio.immobile.caratteristicheAggiuntive.riscaldamentoCentralizzato);
formData.append('immobile.caratteristicheAggiuntive.climatizzatori', annuncio.immobile.caratteristicheAggiuntive.climatizzatori);
formData.append('immobile.caratteristicheAggiuntive.pannelliSolari', annuncio.immobile.caratteristicheAggiuntive.pannelliSolari);
formData.append('immobile.caratteristicheAggiuntive.cantina', annuncio.immobile.caratteristicheAggiuntive.cantina);
formData.append('immobile.caratteristicheAggiuntive.soffitta', annuncio.immobile.caratteristicheAggiuntive.soffitta);

// Immagini
annuncio.immobile.immagini.forEach((img, index) => {
    formData.append(`immobile.immagini[${index}].file`, img.file);
    formData.append(`immobile.immagini[${index}].descrizione`, img.descrizione);
    formData.append(`immobile.immagini[${index}].urlImmagineEsistente`, img.urlImmagineEsistente);
});
// Contratto
formData.append('contratto.tipoDiContratto', annuncio.contratto.tipoDiContratto);
if(annuncio.contratto.tipoDiContratto === 'AFFITTO'){
    formData.append('contratto.datiAffittoRequest.tempoMinimo', annuncio.contratto.datiAffittoRequest.tempoMinimo);
    formData.append('contratto.datiAffittoRequest.tempoMassimo', annuncio.contratto.datiAffittoRequest.tempoMassimo);
    formData.append('contratto.datiAffittoRequest.prezzo', annuncio.contratto.datiAffittoRequest.prezzo);
    formData.append('contratto.datiAffittoRequest.caparra', annuncio.contratto.datiAffittoRequest.caparra||0);
}else{
    formData.append('contratto.datiVenditaRequest.prezzo', annuncio.contratto.datiVenditaRequest.prezzo);
    formData.append('contratto.datiVenditaRequest.mutuoEstinto', annuncio.contratto.datiVenditaRequest.mutuoEstinto);    
}


    
    return ApiAgent()
        .post('pb/test/annuncioImmobiliare', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            return response.data;
        });
}



















function objectToFormData(obj, formData = new FormData(), parentKey = '') {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const formKey = parentKey ? `${parentKey}[${key}]` : key;

            if (value instanceof File) {
                formData.append(formKey, value);
            } else if (value && typeof value === 'object' && !Array.isArray(value)) {
                objectToFormData(value, formData, formKey);
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    objectToFormData(item, formData, `${formKey}[${index}]`);
                });
            } else {
                formData.append(formKey, value);
            }
        }
    }
    return formData;
}