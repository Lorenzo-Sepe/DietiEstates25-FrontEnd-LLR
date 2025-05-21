<template>
  <div class="not-found pb-4 flex items-center justify-center flex-col">
    <img :src="logo" alt="Logo" class="logo" />
    <h1>404 - Pagina non trovata</h1>
    <p>Ci dispiace, ma la pagina che stai cercando non esiste.</p>
    <Button label="Torna alla Home" @click="goHome" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "primevue/button";
import logo from "../assets/Icon/icona.svg"; // Assicurati che il percorso sia corretto

const logoRef = ref(logo);

const goHome = () => {
  // Reindirizza alla home
  const router = useRouter();
  router.push("/");
};
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 50px;
}
.logo {
  width: 150px; /* Modifica la dimensione del logo se necessario */
}
</style>
