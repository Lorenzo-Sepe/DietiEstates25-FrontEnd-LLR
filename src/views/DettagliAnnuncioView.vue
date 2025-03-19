<template>
  <DettagliAnnuncio :annuncio="annuncio" />
</template>

<script setup>
import DettagliAnnuncio from '../components/DettagliAnnuncio.vue';
import TestService from '../services/TestService';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const annuncio = ref(null);
const route = useRoute();

onMounted(async () => {
  try {
    const idAnnuncio = route.params.id;
    
    // Per ora utilizziamo ancora il servizio di test
    // In futuro qui si dovrebbe chiamare un servizio che recupera l'annuncio specifico
    const annunciDiTest = await TestService.getAnnunciDiTest();
    if (annunciDiTest && annunciDiTest.length > 0) {
      // Idealmente qui filtreremmo per l'ID specifico
      annuncio.value = annunciDiTest[0];
      console.log(`Caricato annuncio con ID: ${idAnnuncio}`);
    }
  } catch (error) {
    console.error('Errore durante il recupero dell\'annuncio:', error);
  }
});
</script>