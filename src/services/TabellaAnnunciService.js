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

};

