import axios from 'axios';
import { useEmployeeStore } from '../stores/EmployeeStore.js';
import { useStoreUtente } from '../stores/UserStore.js';
// Definisci l'URL di base come costante
const BASE_URL = 'http://localhost:8081/api/';
const TIMEOUT = 90000; // Timeout per Api e ApiPublic
const AGENT_TIMEOUT = 9000; // Timeout specifico per ApiAgent

// Crea un'istanza di Axios con la configurazione base
const Api = () => {
  const store = useStoreUtente();
  const token= store.utente.token;
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${useStoreUtente.token}`;
  }

  return axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};

const ApiAgent = () => {
  const employeeStoreInstance = useEmployeeStore();
  const token = employeeStoreInstance.employee.token;
  console.log("token:", token);

  return axios.create({
    baseURL: BASE_URL,
    timeout: AGENT_TIMEOUT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};

// Crea un'istanza di Axios per l'API pubblica
const ApiPublic = () => {
  return axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Esporta tutte le istanze
export { Api, ApiAgent, ApiPublic };