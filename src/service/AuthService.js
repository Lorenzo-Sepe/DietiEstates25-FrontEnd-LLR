import Api from '../api/axiosConfig.js'

export default {
    register(credentials) {
        console.log('service register');
        return Api()
            .post('pb/auth/signup', credentials) 
            .then((response) => {
                console.log('register service then', response);
                return response.data;
            });
    },
    login(credentials) {
        return Api()
            .post('pb/auth/signin', credentials)
            .then((response) => response.data);
    },
    logout() {
        return Api()
            .post('reset')
            .then((response) => response.data);
    },
    updateUser(newCredentials) {
        console.log('New Credentials: ', newCredentials);
        return Api()
            .put('/editUser', newCredentials)
            .then((response) => response.data);
    }
};