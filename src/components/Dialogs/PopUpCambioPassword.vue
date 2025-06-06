<template>
  <div v-if="stato === 'caricamento'" class="text-center p-6">
    <p class="text-lg font-semibold mb-2">Controllo sessione in corso...</p>
    <p class="text-gray-500">
      Verifica in corso prima di procedere al cambio password.
    </p>
  </div>

  <div v-else-if="stato === 'inserimento'" class="text-center p-6">
    <p class="text-xl font-semibold mb-2">Cambio password</p>
    <p class="text-gray-600 mt-2">
      Inserisci la tua password attuale e la nuova password.
    </p>

    <!-- Modulo aggiornato per richiedere password attuale -->
    <ModuloPassword @submit="cambiaPassword" cambioPassword />
  </div>

  <div v-else-if="stato === 'successo'" class="text-center p-6 text-green-600">
    <p class="text-xl font-semibold">✅ Password aggiornata</p>
    <p class="text-gray-700 mt-2">
      La tua password è stata cambiata con successo.
    </p>
  </div>

  <div v-else-if="stato === 'errore'" class="text-center p-6 text-red-600">
    <p class="text-xl font-semibold">❌ Errore</p>
    <p class="text-gray-700 mt-2">{{ errore }}</p>
    <Button label="Riprova" class="mt-4" @click="ripristina" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ModuloPassword from "./ModuloPassword.vue";
import Button from "primevue/button";
import AuthService from "../../services/AuthService";

const stato = ref("caricamento");
const errore = ref(null);
const emit = defineEmits(["close", "password-cambiata"]);

onMounted(() => {
  setTimeout(() => {
    stato.value = "inserimento";
  }, 500);
});

const cambiaPassword = async ({
  passwordAttuale,
  password,
  confermaPassword,
}) => {
  errore.value = null;
  alert("Cambiando password...");
  console.log("Password attuale:", passwordAttuale);
  console.log("Nuova password:", password);
  console.log("Conferma password:", confermaPassword);

  if (password !== confermaPassword) {
    errore.value = "Le password nuove non coincidono.";
    stato.value = "errore";
    return;
  }

  try {
    await AuthService.changePassword(
      passwordAttuale,
      password,
      confermaPassword,
    );
    stato.value = "successo";
    emit("password-cambiata");

    setTimeout(() => emit("close"), 2000);
  } catch (e) {
    console.error("Errore cambio password:", e);
    // Gestisci errore specifico di BadCredentialsException
    if (
      e.response?.data?.message?.includes(
        "La password inserita non corrisponde",
      )
    ) {
      errore.value = "La password attuale inserita non è corretta.";
    } else {
      errore.value =
        "Si è verificato un errore durante il cambio password. riprovare più tardi.";
    }
    stato.value = "errore";
  }
};

const ripristina = () => {
  errore.value = null;
  stato.value = "inserimento";
};
</script>
