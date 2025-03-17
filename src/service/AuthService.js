import {Api} from '../api/axiosConfig'
import { useUserStore } from '../stores/UserStore';
import { useEmployeeStore } from '../stores/EmployeeStore';

const userInstance= useUserStore();
const employeeInstance= useEmployeeStore();


export default {
    register(credentials) {
        console.log('service register');
        return Api()
            .post('pb/auth/signup', credentials) 
            .then((response) => {
                //console.log('register service then', response);
                return response.data;
            });
    },
    login(credentials) {
        console.log("I'm in the login", credentials);
        return Api()
            .post('pb/auth/signin', credentials)
            .then((response) => {
                if (response.data.email) {
                    const emailDomain = response.data.email.split('@')[1];
                    if (emailDomain.endsWith('dietiestate.com')) {
                        // Salva i dati nello store degli impiegati
                        employeeInstance.setEmployee(response.data);
                    } else {
                        // Salva i dati nello store degli utenti
                        userInstance.setUser(response.data);
                    }
                    return response.data;
                }
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