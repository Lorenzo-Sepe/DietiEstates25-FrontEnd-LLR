import { ApiPublic,Api } from "../api/axiosConfig";

import { DatiImpiegatoResponse } from "../dto/Response/DatiImpiegato";
import { useStoreUtente } from "../stores/UserStore";
import { useEmployeeStore } from "../stores/EmployeeStore";
import { JwtAuthenticationResponse } from "../dto/Response/JwtAuthenticationResponse";
export function setUser (response) {
    // Crea un'istanza di JwtAuthenticationResponse utilizzando la risposta
    const jwtResponse = new JwtAuthenticationResponse(response);

    if(jwtResponse.authority="MEMBER"){ 
    // Imposta i dati dell'utente nello store
    const store = useStoreUtente();
    store.utente.email=jwtResponse.email;
    store.utente.token=jwtResponse.token;  
    }else{
        const store=  useEmployeeStore();
        store.employee.email=jwtResponse.email;
        store.employee.token=jwtResponse.token;  
    }


}

export function getDatiImpiegato(email) {
    return ApiPublic()
        .get('pb/agenzia/email', { params: { email } })
        .then((response) => {
            console.log('pb/agenzia/email response: ', response);
            const res = new DatiImpiegatoResponse(response.data);
            return res;
        })
        .catch((error) => {
            if (error.response) {
                // Gestisci gli errori basati sullo status code
                if (error.response.status === 404) {
                    console.error('Errore 404: Con l\'email fornita  non abbiamo trovato nessun DatoImpiegato associato');
                    return null; // Restituisci null o un valore di fallback
                } else {
                    console.error('Errore:', error.response.status, error.response.data);
                    throw new Error('Errore durante il recupero dei dati.');
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
export function getDatiPrivatiUser(){
    Api
}