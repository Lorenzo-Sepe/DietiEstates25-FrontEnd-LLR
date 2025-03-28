<!-- Start of Selection -->
<template>
  <div class="flex flex-col w-screen h-screen">
      <div class="rounded border border-surface-200 p-6 flex-1">
          <div class="flex mb-4">
              <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
              <div>
                  <Skeleton width="10rem" class="mb-2"></Skeleton>
                  <Skeleton width="5rem" class="mb-2"></Skeleton>
                  <Skeleton height=".5rem"></Skeleton>
              </div>
          </div>
          <Skeleton width="100%" height="150px"></Skeleton>
          <div class="flex justify-between mt-4">
              <Skeleton width="4rem" height="2rem"></Skeleton>
              <Skeleton width="4rem" height="2rem"></Skeleton>
          </div>
      </div>
      <div class="rounded border border-surface-200 p-6 flex-1">
          <div class="flex mb-4">
              <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
              <div>
                  <Skeleton width="10rem" class="mb-2"></Skeleton>
                  <Skeleton width="5rem" class="mb-2"></Skeleton>
                  <Skeleton height=".5rem"></Skeleton>
              </div>
          </div>
          <Skeleton width="100%" height="150px"></Skeleton>
          <div class="flex justify-between mt-4">
              <Skeleton width="4rem" height="2rem"></Skeleton>
              <Skeleton width="4rem" height="2rem"></Skeleton>
          </div>
      </div>
      <div class="rounded border border-surface-200 p-6 flex-1">
          <div class="flex mb-4">
              <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
              <div>
                  <Skeleton width="10rem" class="mb-2"></Skeleton>
                  <Skeleton width="5rem" class="mb-2"></Skeleton>
                  <Skeleton height=".5rem"></Skeleton>
              </div>
          </div>
          <Skeleton width="100%" height="150px"></Skeleton>
          <div class="flex justify-between mt-4">
              <Skeleton width="4rem" height="2rem"></Skeleton>
              <Skeleton width="4rem" height="2rem"></Skeleton>
          </div>
      </div>
  </div>
</template>
<!-- End of Selection -->

<script setup>
import { ref ,watch} from 'vue';
import AuthService from '../services/AuthService';
import { useUserStore } from '../stores/UserStore'; // Assicurati di avere il percorso corretto
import Skeleton from 'primevue/skeleton';
import { useRouter } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';

const { idTokenClaims } = useAuth0();

const userStoreInstance = useUserStore();
const router = useRouter();
const userData = ref({});

// Funzione per recuperare i dati dell'utente
const fetchUserData = async () => {
    if (idTokenClaims.value) {
        try {
          console.log(idTokenClaims.value.__raw);  
          const response = await AuthService.loginIdProvvider(idTokenClaims.value.__raw);
          console.log(response);
        } catch (error) {
          console.error('Errore durante il recupero dei dati dell\'utente:', error);
          if (error.response) {
              console.log('Codice risposta:', error.response.status);
              console.log('Messaggio risposta:', error.response.statusText);
          }
        }
    }
};

// Esegui la funzione non appena idTokenClaims è definito
watch(() => idTokenClaims.value, (newValue) => {
    if (newValue) {
        fetchUserData();
    }
});



</script>

<style scoped>
/* Stili personalizzati per la vista */
</style>
