import { ApiAgent } from "../api/axiosConfig";

export default {
  getAnnunciByStaff(filtro) {
    return ApiAgent()
      .post("annuncioImmobiliare/cercaByStaff", filtro)
      .then((response) => {
        return response.data;
      });
  },

  getNumeroAnnunciByStaff(filtro) {
    return ApiAgent()
      .post("annuncioImmobiliare/numeroByStaff", filtro)
      .then((response) => {
        return response.data;
      });
  },

  postPropostaManuale(proposta) {
    return ApiAgent()
      .post("proposta/manuale", proposta)
      .then((response) => {
        return response.data;
      });
  },

  eliminaAnnuncio(idAnnuncio) {
    return ApiAgent()
      .delete(`annuncioImmobiliare/${idAnnuncio}`)
      .then((response) => {
        return response.data;
      });
  },

};
