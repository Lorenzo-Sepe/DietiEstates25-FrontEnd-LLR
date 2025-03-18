import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import PrimeVue from "primevue/config"
import MyPreset from './themes/myPreset'
import router from './router'
import 'primeicons/primeicons.css'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';


const app = createApp(App)
const pinia = createPinia()

app.use(PrimeVue, {
    ripple: true,
    theme: {
        preset: MyPreset,
        options:{
            darkModeSelector: '.my-app-dark'       
        }
    },
})

app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);
app.directive('tooltip', Tooltip);


app.use(pinia)
app.use(router)
app.mount('#app')
