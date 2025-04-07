import { DatiAgenziaImmobiliareResponse } from "../dto/Response/DatiAgenziaImmobiliareResponse";
import { ApiPublic,ApiAgent } from "../api/axiosConfig";

export default{
    async addEmployee(credentials){
        return ApiAgent()
        .post('agenzia/dipendente',credentials)
        .then((response)=> {
            return response.data
        })
    },
    async registerAgency(credentials){
        console.log('register agency promise', credentials)
        return ApiPublic()
        .post('pb/agenzia/', credentials)
        .then((response)=>{
            console.log('register agency respose', response )
            return response.data;
        })
    },
    async getDatiAgenziaByEmailDipendente(email) {
        return ApiPublic()
            .get('/pb/agenzia/email', { params: { email } })
            .then((response) => {
                console.log('/pb/agenzia/email response: ', response);
                const res = new DatiAgenziaImmobiliareResponse(response.data);
                return res;
            })
            .catch((error) => {
                if (error.response) {
                    // Gestisci gli errori basati sullo status code
                    if (error.response.status === 404) {
                        console.error('Errore 404: Con l\'email fornita non abbiamo trovato nessuna agenzia immobiliare associata');
                        return null; // Restituisci null o un valore di fallback
                    } else {
                        console.error('Errore:', error.response.status, error.response.data);
                        throw new Error('Errore durante il recupero dei dati dell\'agenzia immobiliare.');
                    }
                } else if (error.request) {
                    console.error('Nessuna risposta ricevuta dal server:', error.request);
                    throw new Error('Nessuna risposta dal server.');
                } else {
                    console.error('Errore:', error.message);
                    throw new Error('Errore nella richiesta.');
                }
            });
    },
};

export function getDatiAgenziaByEmailDipendente(email) {
    return ApiPublic()
        .get('/pb/agenzia/email', { params: { email } })
        .then((response) => {
            console.log('/pb/agenzia/email response: ', response);
            const res = new DatiAgenziaImmobiliareResponse(response.data);
            return res;
        })
        .catch((error) => {
            if (error.response) {
                // Gestisci gli errori basati sullo status code
                if (error.response.status === 404) {
                    console.error('Errore 404: Con l\'email fornita non abbiamo trovato nessuna agenzia immobiliare associata');
                    return null; // Restituisci null o un valore di fallback
                } else {
                    console.error('Errore:', error.response.status, error.response.data);
                    throw new Error('Errore durante il recupero dei dati dell\'agenzia immobiliare.');
                }
            } else if (error.request) {
                console.error('Nessuna risposta ricevuta dal server:', error.request);
                throw new Error('Nessuna risposta dal server.');
            } else {
                console.error('Errore:', error.message);
                throw new Error('Errore nella richiesta.');
            }
        });
}