import axios from 'axios'
import { useEmployeeStore } from '../stores/EmployeeStore.js';
import { useUserStore } from '../stores/UserStore.js'


// Crea un'istanza di Axios con la configurazione base
const Api = () => {
  const userStoreInstance = useUserStore()
  const token = userStoreInstance.user.token;
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${userStoreInstance.token}`;
  }

  return axios.create({
    baseURL: 'http://localhost:8081/api/',
    timeout: 90000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};

const ApiAgent = () => {
  const employeeStoreInstance = useEmployeeStore()
  const token = employeeStoreInstance.employee.token;
  console.log("token:", token)

  return axios.create({
    baseURL: 'http://localhost:8081/api/',
    timeout: 5000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};

// Esporta entrambe le istanze
export { Api, ApiAgent };


