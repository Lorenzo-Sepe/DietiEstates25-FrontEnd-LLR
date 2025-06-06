<template>
  <div v-if="stato === 'caricamento'" class="text-center p-6">
    <p class="text-lg font-semibold mb-2">
      {{
        props.modalita === "registrazione"
          ? "Preparazione registrazione..."
          : "Accesso in corso..."
      }}
    </p>
    <p class="text-gray-500">
      Attendi mentre completiamo
      {{
        props.modalita === "registrazione" ? "la registrazione" : "l'accesso"
      }}
      con {{ providerNames[props.currentProvider] }}.
    </p>
  </div>
  <div v-else-if="stato === 'verifica'" class="text-center p-6">
    <p class="text-lg font-semibold mb-2">Verifica account...</p>
    <p class="text-gray-500">
      Controlliamo se esiste un account collegato a
      <strong>{{ utente?.email || "la tua email" }}</strong
      >.
    </p>
  </div>

  <div v-else-if="stato === 'pronto'">
    <div class="text-center mb-4">
      <p class="text-xl font-semibold">Ciao {{ utente?.name || "utente" }}</p>
      <p class="text-gray-600 mt-1">
        Stai creando un account con l'email:
        <strong>{{ utente?.email }}</strong>
      </p>
      <p class="text-gray-500 mt-2">
        Imposta una password per completare la registrazione.
      </p>
    </div>
    <ModuloPassword @submit="completaRegistrazione" />
  </div>
  <div v-else-if="stato === 'esistente'" class="text-center p-6">
    <p class="text-xl font-semibold">
      Bentornato {{ utente?.name || "utente" }} 👋
    </p>
    <p class="text-gray-600 mt-2">
      Hai già un account associato all'email <strong>{{ utente?.email }}</strong
      >.
    </p>
    <p class="text-gray-500 mt-2">
      Verrai reindirizzato alla home. Vuoi procedere?
    </p>
    <Button class="mt-4" label="Vai alla home" @click="vaiAllaHome" />
  </div>
  <div v-else-if="stato === 'offriRegistrazione'" class="text-center p-6">
    <p class="text-xl font-semibold">Account non trovato</p>
    <p class="text-gray-600 mt-2">
      Non esiste alcun account associato all'email
      <strong>{{ utente?.email }}</strong
      >.
    </p>
    <p class="text-gray-500 mt-2">
      Imposta una password per completare la registrazione.
    </p>
    <ModuloPassword @submit="completaRegistrazione" />
  </div>

  <div v-else-if="stato === 'errore'" class="text-center p-6 text-red-600">
    <p class="font-semibold">Si è verificato un errore durante il login.</p>
    <p>Riprova o contatta il supporto.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ModuloPassword from "./ModuloPassword.vue";
import Button from "primevue/button";
import AuthService from "../../services/AuthService";
import { useAuth0 } from "@auth0/auth0-vue";
import { useRouter } from "vue-router";

const { loginWithPopup, user, idTokenClaims } = useAuth0();
const router = useRouter();
const emit = defineEmits([
  "close",
  "autenticazione-errore",
  "autenticazione-successo",
]);

const props = defineProps({
  currentProvider: String,
  modalita: {
    type: String,
    default: "registrazione", // 'login' o 'registrazione'
  },
});

const providerNames = {
  "google-oauth2": "Google",
  facebook: "Facebook",
  github: "GitHub",
};

const stato = ref("caricamento"); // può essere: 'caricamento', 'pronto', 'errore'

const utente = ref(null); // Per visualizzare il nome utente

const ruoloLogin = ref("");

const vaiAllaHome = () => {
  emit("autenticazione-successo");
  emit("close");
  reindirizza(ruoloLogin.value);
};

onMounted(async () => {
  try {
    await loginWithPopup({
      authorizationParams: {
        screen_hint: "signup",
        connection: props.currentProvider,
        scope: "openid profile email",
      },
    });

    utente.value = user.value;
    stato.value = "verifica";

    try {
      const response = await AuthService.loginIdProvvider(
        idTokenClaims.value.__raw,
      );

      if (props.modalita === "registrazione") {
        // Caso limite: utente esiste già ma ha cliccato "Registrati"
        ruoloLogin.value = response.ruolo;
        stato.value = "esistente";
      } else {
        // Accesso riuscito, vai subito alla home
        emit("autenticazione-successo");
        emit("close");
        reindirizza(response.ruolo);
      }
    } catch (erroreLogin) {
      if (erroreLogin.response?.status === 404) {
        if (props.modalita === "login") {
          // L'utente ha provato ad accedere ma non esiste offri la possibilità di registrarsi
          stato.value = "offriRegistrazione";
        } else {
          stato.value = "pronto"; // procedi normale con registrazione
        }
      } else {
        stato.value = "errore";
        emit("autenticazione-errore", erroreLogin);
        emit("close", erroreLogin);
      }
    }
  } catch (errore) {
    stato.value = "errore";
    console.error("Errore durante il login con Auth0:", errore);
    emit("autenticazione-errore", errore);
    emit("close", errore);
  }
});

const completaRegistrazione = async ({ password, confermaPassword }) => {
  try {
    const risposta = await AuthService.register({
      email: utente.value.email,
      nomeVisualizzato: utente.value.name,
      password: password,
    });

    console.log("Registrazione avvenuta con successo:", risposta);
    // Reindirizza alla home o mostra un messaggio di successo
    emit("autenticazione-successo");
    emit("close", risposta);
    reindirizza(risposta.ruolo);
  } catch (errore) {
    console.error("Errore nella registrazione:", errore);
    emit("autenticazione-errore", errore);
    emit("close", errore);
  }
};

function reindirizza(ruolo) {
  console.log("Reindirizzamentoooooooooooooooooooooooo");
  if (ruolo === "MEMBER") {
    router.push({ path: "/" });
  } else {
    router.push({ path: "/PortaleAgenzia" });
  }
}
</script>
