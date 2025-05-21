// authService.js
import { LoginData } from "../dto/Request/Auth/SignInRequest"; // Importa la classe

const API_URL = "https://your-api-endpoint/login"; // Sostituisci con il tuo endpoint

export function createInstance(ClassType, data) {
  return new ClassType(...Object.values(data));
}

export const authService = {
  async login(datiInput) {
    const loginData = new LoginData(datiInput);

    // Esegui la chiamata API con loginData
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    // Gestisci la risposta
    return response.json();
  },
};
