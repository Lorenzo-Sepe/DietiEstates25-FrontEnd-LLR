import { createApp } from 'vue'
import './style/style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import PrimeVue from "primevue/config"
import MyPreset from './themes/myPreset'

const app = createApp(App)
const pinia = createPinia()

app.use(PrimeVue, {
    unstyled: true,
    pt: MyPreset
})

app.use(pinia)
app.mount('#app')
