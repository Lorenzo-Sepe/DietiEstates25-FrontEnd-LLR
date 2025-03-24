import { Api, ApiAgent } from '../api/axiosConfig'

export default {

    getSottoscrizioni() {

        return Api()
            .get('sottoscrizioni')
            .then((response) => {
                return response.data;
            })
    },

    getNumeroNotifiche() {

        return Api()
            .get('numeroNotifica')
            .then((response) => {
                return response.data;
            })
    },

    getNotifiche(pagina) {

        return Api()
            .get('notifiche?page='+pagina+'&numeroPerPage=5&discedente=true')
            .then((response) => {
                return response.data;
            })
    },

    getNumeroNotificheByCategoria(idCategoria) {

        return Api()
            .get('numeroNotificheByCategoria?idCategoria='+idCategoria)
            .then((response) => {
                return response.data;
            })
    },

    getNotificheByCategoria(pagina,idCategoria) {

        return Api()
            .get('notificheByCategoria?page='+pagina+'&numeroPerPage=5&discedente=true&idCategoria='+idCategoria)
            .then((response) => {
                return response.data;
            })
    },


};

