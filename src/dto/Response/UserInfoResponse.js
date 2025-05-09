export class UserInfoResponse {
  constructor(data = {}) {
    this.urlFotoProfilo = data.urlFotoProfilo || "";
    this.email = data.email || "";
    this.nomeVisualizzato = data.nomeVisualizzato || "";
    this.tipoAccount = data.tipoAccount || "";
  }
}
