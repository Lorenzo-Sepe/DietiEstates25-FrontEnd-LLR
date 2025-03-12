import axios from 'axios'
import {useUserStore} from '../stores/UserStore.js'

const userStoreInstance = useUserStore()

// Crea un'istanza di Axios con la configurazione base
const api = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Aggiungi un interceptor per le richieste
api.interceptors.request.use(
  (config) => {
    //const token = localStorage.getItem('token') // o dove conservi il tuo token
    const token = userStoreInstance.token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api 