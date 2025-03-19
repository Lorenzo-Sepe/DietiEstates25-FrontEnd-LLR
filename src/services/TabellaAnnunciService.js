import {Api, ApiAgent} from '../api/axiosConfig'

export default {

    getAnnunciByStaff(filtro){

        return ApiAgent()
            .post('annuncioImmobiliare/cercaByStaff',filtro)
            .then((response) => {
                return response.data;
            })
    },

    getNumeroAnnunciByStaff(){

        return ApiAgent()
            .get('annuncioImmobiliare/numeroByStaff')
            .then((response) => {
                return response.data;
            })
    },

    postPropostaManuale(proposta){

        return ApiAgent()
            .post('proposta/manuale',proposta)
            .then((response) => {
                return response.data;
            })
    }

};

