import { Api, ApiAgent, ApiPublic } from '../api/axiosConfig'

export default {

    getNumeroAnnunci(filtro) {

        return ApiPublic()
        .post('pb/annuncioImmobiliare/numero', filtro)
            .then((response) => {
                return response.data;
            })
    }

};
