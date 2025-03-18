import {Api} from '../api/axiosConfig'

export default {
    test(id){
        return Api().get('/pb/test/getToken', { params: { id } })
        .then((response) => response.data);
    },
};