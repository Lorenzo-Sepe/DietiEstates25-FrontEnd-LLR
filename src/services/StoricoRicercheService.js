import { Api } from "../api/axiosConfig";
export default {
  getStoricoRicercheUtente() {
    return Api()
      .get("/storicoRicerche")
      .then((response) => {
        return response.data;
      });
  },
};
