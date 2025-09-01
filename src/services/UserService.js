import { ApiPublic, Api, ApiAgent } from "../api/axiosConfig";
import { UserInfoResponse } from "../dto/Response/UserInfoResponse";
import { DatiImpiegatoResponse } from "../dto/Response/DatiImpiegato";
import { useStoreUtente } from "../stores/UserStore";
import { useEmployeeStore } from "../stores/EmployeeStore";
import { JwtAuthenticationResponse } from "../dto/Response/JwtAuthenticationResponse";

/**
 * Imposta i dati dell'utente o dell'impiegato nello store in base all'autorità ricevuta nella risposta.
 *
 * @param {Object} response - La risposta contenente i dati di autenticazione JWT.
 * @returns {Object} - Oggetto contenente un messaggio e l'authority
 */
export function setUser(response) {
  // Crea un'istanza di JwtAuthenticationResponse utilizzando la risposta
  const jwtResponse = new JwtAuthenticationResponse(response);

  if (jwtResponse.authority === "MEMBER") {
    // Imposta i dati dell'utente nello store utente
    const store = useStoreUtente();
    const email = jwtResponse.email;
    const token = jwtResponse.token;
    store.impostaUtente(email, token);

    return {
      messaggio: "Utente normale impostato nello store.",
      ruolo: jwtResponse.authority,
    };
  } else {
    // Imposta i dati dell'impiegato nello store impiegato
    const store = useEmployeeStore();
    const email = jwtResponse.email;
    const token = jwtResponse.token;
    store.impostaImpiegato(email, token);

    return {
      messaggio: "Utente agente impostato nello store.",
      ruolo: jwtResponse.authority,
    };
  }
}

export function getDatiImpiegato(email) {
  return ApiPublic()
    .get("/pb/impiegato/email", { params: { email } })
    .then((response) => {
      const res = new DatiImpiegatoResponse(response.data);
      return res;
    })
    .catch((error) => {
      if (error.response) {
        // Gestisci gli errori basati sullo status code
        if (error.response.status === 404) {
          console.error(
            "Errore 404: Con l'email fornita  non abbiamo trovato nessun DatoImpiegato associato",
          );
          return null; // Restituisci null o un valore di fallback
        } else {
          console.error("Errore:", error.response.status, error.response.data);
          throw new Error("Errore durante il recupero dei dati.");
        }
      } else if (error.request) {
        console.error("Nessuna risposta ricevuta dal server:", error.request);
        throw new Error("Nessuna risposta dal server.");
      } else {
        console.error("Errore:", error.message);
        throw new Error("Errore nella richiesta.");
      }
    });
}

export async function aggiungiContattoDipendente(contattoRequest){

  return ApiAgent()
  .post("agenzia/dipendente/contatto", contattoRequest)
  .then( (response) => {
    return response.data
  })
  .catch( (error) => {
    console.error("Errore durante l'aggiunta del contatto:", error);
  });
}

export async function isTokenValid(email) {
  try {
    await ApiAgent().get("user", { params: { email } });
    return true;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403) {
        console.warn("Attenzione: Token non valido o scaduto.");
        return false;
      } else {
        console.error("Errore:", error.response.status, error.response.data);
        throw new Error("Errore durante il recupero dei dati.");
      }
    } else if (error.request) {
      console.error("Nessuna risposta ricevuta dal server:", error.request);
      throw new Error("Nessuna risposta dal server.");
    } else {
      console.error("Errore:", error.message);
      throw new Error("Errore nella richiesta.");
    }
  }
}

export function getDatiUser(email) {
  return ApiPublic()
    .get("/pb/user", { params: { email } })
    .then((response) => {
      const ret = new UserInfoResponse(response.data); // Restituisci l'oggetto creato
      if (
        ret.UrlFotoProfilo === null ||
        ret.UrlFotoProfilo === undefined ||
        ret.UrlFotoProfilo === ""
      ) {
        ret.UrlFotoProfilo = getDefaultAvatar(email);
      }
      return ret;
    })
    .catch((error) => {
      if (error.response) {
        // Gestisci gli errori basati sullo status code
        if (error.response.status === 404) {
          console.error(
            "Errore 404: Nessun utente trovato con l'email fornita.",
          );
        } else {
          console.error("Errore:", error.response.status, error.response.data);
        }
        throw new Error("Errore durante il recupero dei dati dell'utente.");
      } else if (error.request) {
        console.error("Nessuna risposta ricevuta dal server:", error.request);
        throw new Error("Nessuna risposta dal server.");
      } else {
        console.error("Errore:", error.message);
        throw new Error("Errore nella richiesta.");
      }
    });
}

/**
 * Genera un URL per un avatar predefinito basato sulla prima lettera di una stringa
 * e utilizza l'intera stringa come seed per generare un colore.
 * @param {string} inputString - La stringa da cui estrarre l'iniziale.
 * @param {number} width - Larghezza dell'avatar (default: 400).
 * @param {number} height - Altezza dell'avatar (default: 400).
 * @returns {string|null} - L'URL dell'avatar o null se l'input non è valido.
 */
export function getDefaultAvatar(inputString, width = 400, height = 400) {
  if (typeof inputString !== "string" || inputString.trim() === "") {
    console.warn("Warning: L'input deve essere una stringa non vuota.");
    return null;
  }

  // Prendi la prima lettera dell'input
  const initial = inputString.trim()[0].toUpperCase();

  // Funzione di hashing semplice per generare un numero da una stringa
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash; // Converti a 32 bit
    }
    return Math.abs(hash);
  };

  // Genera un valore di colore basato sull'hash della stringa
  const colorValue = hashString(inputString) % 256;
  const backgroundColor = `${colorValue.toString(16).padStart(2, "0")}00${(255 - colorValue).toString(16).padStart(2, "0")}`;

  return `https://placehold.co/${width}x${height}/${backgroundColor}/FFFFFF?text=${initial}`;
}
