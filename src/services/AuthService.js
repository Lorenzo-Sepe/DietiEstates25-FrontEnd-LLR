import {Api} from '../api/axiosConfig'

import { setUser } from './UserService';
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
                setUser(response.data);
                return response.data;
            });
    },
    loginIdProvvider(credentials){
        //console.log('service login config:',Api);
        return Api()
        .post('pb/auth/signinIdProv',credentials)
        .then((response)=>{
            console.log('Id provvider success,',response);
            setUser(response.data);
            return response.data;
        })
    },
    registerIdProvvider(credentials){
        //console.log('service register config:',Api);
        return Api()
        .post('pb/auth/registerIdProv',credentials)
        .then((response)=> {
            console.log('Id provvider success,',response);
            return response.data;
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