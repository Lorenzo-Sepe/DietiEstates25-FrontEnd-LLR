import { Api, ApiAgent, ApiPublic } from "../api/axiosConfig";
import { useStoreUtente } from "../stores/UserStore";
export default {
  getNumeroAnnunci(filtro) {
    return ApiPublic()
      .post("pb/annuncioImmobiliare/numero", filtro)
      .then((response) => {
        return response.data;
      });
  },

 getAnnunci(filtro) {
    const isAutenticato = useStoreUtente().isAutenticato;    
    //console.log("Utente autenticato: ", isAutenticato);
    //console.log("Filtro per la ricerca degli annunci: ", filtro);
    // Logica per autenticato
    if (isAutenticato) {
        return Api()
            .post("annuncioImmobiliare/cerca", filtro)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error("Errore durante la chiamata API (autenticato):", error);
                throw error; // Rilancia l'errore per una gestione successiva
            });
    } else {
        // Logica per non autenticato
        return ApiPublic()
            .post("pb/annuncioImmobiliare/cerca", filtro)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error("Errore durante la chiamata API (non autenticato):", error);
                throw error; // Rilancia l'errore per una gestione successiva
            });
    }
},

  getAnnuncioImmobiliare(id) {
    return ApiPublic()
      .get("/pb/annuncioImmobiliare/" + id)
      .then((response) => {
        return response.data;
      });
  },
};
