import { Api, ApiAgent, ApiPublic } from '../api/axiosConfig'
import { useStoreUtente } from '../stores/UserStore'
export default {

    getNumeroAnnunci(filtro) {

        return ApiPublic()
        .post('pb/annuncioImmobiliare/numero', filtro)
            .then((response) => {
                return response.data;
            })
    },

    getAnnunci(filtro) {
        const api = useStoreUtente().isAutenticato ? Api() : ApiPublic();
        const endpoint = useStoreUtente().isAutenticato ? 'annuncioImmobiliare/cerca' : 'pb/annuncioImmobiliare/cerca';
        console.log("utente autenticato: ", useStoreUtente().isAutenticato);
        return api.post(endpoint, filtro)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error('Errore durante la chiamata API:', error);
                throw error; // Rilancia l'errore per una gestione successiva
            });
    },
    
    getAnnuncioImmobiliare(id){
        return ApiPublic()
        .get('/pb/annuncioImmobiliare/' + id)
        .then((response) => {
            return response.data;
        })
    }

};
