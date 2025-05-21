export class JwtAuthenticationResponse {
  constructor(data = {}) {
    this.id = data.id || 0; // Imposta un valore predefinito per id
    this.nomeVisualizzato = data.nomeVisualizzato || "";
    this.urlFotoProfilo = data.urlFotoProfilo || ""; // Nota: ho corretto la capitalizzazione per coerenza
    this.email = data.email || "";
    this.authority = data.authority || "";
    this.token = data.token || "";
  }
}
