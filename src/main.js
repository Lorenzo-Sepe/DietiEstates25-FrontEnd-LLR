import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import MyPreset from "./themes/myPreset";
import router from "./router";
import "primeicons/primeicons.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ConfirmationService from "primevue/confirmationservice";
import DialogService from "primevue/dialogservice";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";
import piniaPersistedState from "pinia-plugin-persistedstate";
import { createAuth0 } from "@auth0/auth0-vue";

const app = createApp(App);

//const pinia = createPinia()

app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: ".my-app-dark",
    },
  },
});

// inizializzazione auth0
app.use(
  createAuth0({
    domain: "dev-16vw3v8k1jpn1obn.us.auth0.com",
    clientId: "XVNwEJow6VjIO56oApqlTYeeyt8pgzvI",
    authorizationParams: {
      redirect_uri: window.location.origin + "/callback",
    },
  }),
);

app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);
app.directive("tooltip", Tooltip);

app.use(router);

const pinia = createPinia();
pinia.devtools = true;
pinia.use(({ store }) => {
  store.$onAction(({ name }) => {
    
  });
});

pinia.use(piniaPersistedState); // Abilita la persistenza

app.use(pinia);

app.mount("#app");
