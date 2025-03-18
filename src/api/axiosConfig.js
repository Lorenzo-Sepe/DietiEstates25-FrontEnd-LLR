import axios from 'axios'
import { useEmployeeStore } from '../stores/EmployeeStore.js';
import {useUserStore} from '../stores/UserStore.js'

const userStoreInstance = useUserStore()
const employeeStoreInstance = useEmployeeStore()


// Crea un'istanza di Axios con la configurazione base
const Api = () => {
  const token = userStoreInstance.token;
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${userStoreInstance.token}`;
  }
 
  return axios.create({
    baseURL: 'http://localhost:8081/api/',
    timeout: 90000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const ApiAgent = () => {
  const token = employeeStoreInstance.token;
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return axios.create({
    baseURL: 'http://localhost:8081/api/',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Esporta entrambe le istanze
export { Api, ApiAgent };


 