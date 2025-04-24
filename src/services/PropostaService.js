import { Api, ApiAgent } from "../api/axiosConfig";

export default {
  rifiutaProposta(idProposta) {
    return ApiAgent()
      .post("proposta/" + idProposta + "/rifiuta")
      .then((response) => {
        return response.data;
      });
  },

  accettaProposta(idProposta) {
    return ApiAgent()
      .post("proposta/" + idProposta + "/accetta")
      .then((response) => {
        return response.data;
      });
  },

  controproposta(idProposta, prezzoControproposta) {
    return ApiAgent()
      .post(
        "proposta/" +
          idProposta +
          "/controproposta?controproposta=" +
          prezzoControproposta
      )
      .then((response) => {
        return response.data;
      });
  },

  inviaNuovaProposta(propostaRequest) {
    return Api()
      .post("proposta", propostaRequest)
      .then((response) => {
        return response.data;
      });
  },
};
