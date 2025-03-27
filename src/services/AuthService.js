import {Api} from '../api/axiosConfig'


export default {
    register(credentials) {
        console.log('service register');
        return Api()
            .post('pb/auth/signup', credentials) 
            .then((response) => {
                return response.data;
            });
    },
    login(credentials) {
        console.log('service login');
        return Api()
            .post('pb/auth/signin', credentials)
            .then((response) => {
                console.log('login service then', response);
                return response.data;
            });
    },
    logout() {
        return Api()
            .post('auth/logout')
            .then((response) => response.data);
    },
    updateUser(newCredentials) {
        console.log('New Credentials: ', newCredentials);
        return Api()
            .put('auth/change_password', newCredentials)
            .then((response) => response.data);
    }
};