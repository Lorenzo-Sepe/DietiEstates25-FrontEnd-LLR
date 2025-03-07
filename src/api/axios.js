import axios from 'axios'

// Crea un'istanza di Axios con la configurazione base
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Aggiungi un interceptor per le richieste
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // o dove conservi il tuo token
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