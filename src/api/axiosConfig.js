import axios from 'axios'
import {useUserStore} from '../stores/UserStore.js'

const userStoreInstance = useUserStore()

// Crea un'istanza di Axios con la configurazione base
export const Api =()=>{
  const token=userStoreInstance.token;
  if (token){
    axios.defaults.headers.common['Authorization'] = `Bearer ${userStoreInstance.token}`
    }
  return axios.create({
    baseURL: 'http://localhost:8081/',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json'
    }
  })
};

export const ApiAgent = () => {
  const token = userStoreInstance.tokenAgent;
  if (token){
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  return axios.create({
    baseURL: 'http://localhost:8081',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json'
    }
  })
};


 