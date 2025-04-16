import { Api, ApiAgent, ApiPublic } from '../api/axiosConfig'

export default {

    getNumeroAnnunci(filtro) {

        return ApiPublic()
        .post('pb/annuncioImmobiliare/numero', filtro)
            .then((response) => {
                return response.data;
            })
    },

    getAnnunciByAnonimo(filtro){

        return ApiPublic()
        .post('pb/annuncioImmobiliare/cerca',filtro)
        .then( (response) => {
            return response.data;
        })
    },

    getAnnuncioImmobiliare(id){
        return ApiPublic()
        .get('/pb/annuncioImmobiliare/' + id)
        .then((response) => {
            return response.data;
        })
    }

};
