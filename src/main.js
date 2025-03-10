import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import PrimeVue from "primevue/config"
import MyPreset from './themes/myPreset'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(PrimeVue, {
    theme: {
        preset: MyPreset
    },
})

app.use(pinia)
app.use(router)
app.mount('#app')
