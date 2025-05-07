import {Api} from '../api/axiosConfig'

import { setUser } from './UserService';
export default {
    register(credentials) {
        console.log('service register');
        return Api()
            .post('pb/auth/signup', credentials) 
            .then((response) => {
                return setUser(response.data);
            });
    },
    
    login(credentials) {
        console.log('service login');
        return Api()
            .post('pb/auth/signin', credentials)
            .then((response) => {
                console.log('login service then', response);
                return setUser(response.data);

            });
    },
    loginIdProvvider(credentials){
        return Api()
        .post('pb/auth/signinIdProv',credentials)
        .then((response)=>{
            console.log('Id provvider success,',response);
            return setUser(response.data);

        })
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
    },
    
    

};