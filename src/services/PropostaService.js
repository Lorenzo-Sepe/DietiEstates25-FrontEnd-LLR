import {Api, ApiAgent} from '../api/axiosConfig'

export default {

    rifiutaProposta(idProposta){

        return ApiAgent()

            .post('proposta/' + idProposta + '/rifiuta')
            .then((response) => {
                return response.data;
            })
    },

    accettaProposta(idProposta){

        return ApiAgent()

            .post('proposta/' + idProposta + '/accetta')
            .then((response) => {
                return response.data;
            })
    }

};

