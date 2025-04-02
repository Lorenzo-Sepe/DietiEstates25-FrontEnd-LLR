export class UserInfoResponse {
    constructor(data = {}) {
        this.UrlFotoProfilo = data.UrlFotoProfilo || "";
        this.email = data.email || "";
        this.nomeVisualizzato = data.nomeVisualizzato || "";
        this.tipoAccount = data.tipoAccount || "";
    }
}