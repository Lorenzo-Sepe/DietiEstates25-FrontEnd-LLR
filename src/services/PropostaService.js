import {Api, ApiAgent} from '../api/axiosConfig'

export default {

    deleteProposta(idProposta){

        return ApiAgent()

            .post('proposta/' + idProposta + '/rifiuta')
            .then((response) => {
                return response.data;
            })
    }

};

