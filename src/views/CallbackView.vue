<template>
  <div>
    <Skeleton v-if="loading" />
    <div v-else>
      <h1>Benvenuto!</h1>
      <p>ID: {{ user.nickname }}</p>
      <p>Nome: {{ user.given_name }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Token: {{ user }}</p>
      <img :src="user.picture" alt="Foto Profilo" v-if="user.picture" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/UserStore'; // Assicurati di avere il percorso corretto
import Skeleton from 'primevue/skeleton';
import { useRouter } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';



const { loginWithRedirect,loginWithPopup, user, isAuthenticated ,getAccessTokenSilently} = useAuth0();

const loading = ref(true);
const store = useUserStore();
const router = useRouter();
const userData = ref({});

// Funzione per recuperare i dati dell'utente
const fetchUserData = async () => {
  // Simulazione di una chiamata al server per ottenere i dati dell'utente
  const response = await store.getUserData(); // Assicurati che questa funzione esista nel tuo store
  userData.value = response;
  loading.value = false;
};

onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
/* Stili personalizzati per la vista */
</style>
