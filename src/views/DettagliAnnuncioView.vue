<template>

  <DettagliAnnuncio :annuncio="annuncioResponse" />

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { AnnuncioImmobiliareResponse } from '../dto/Response/AnnuncioImmobiliareResponse.js';
import AnnunciImmobiliService from '../services/AnnunciImmobiliService.js';

import DettagliAnnuncio from '../components/DettaglioAnnuncio/DettaglioAnnuncio.vue';

const route = useRoute();

const annuncioResponse = ref(null);
const mostraDialogCardAgente = ref(false);

onMounted(async () => {

  const response = await AnnunciImmobiliService.getAnnuncioImmobiliare(route.params.id);
  annuncioResponse.value = new AnnuncioImmobiliareResponse(response)
  console.log('response:', response.value);

});

function formattaPrezzo(prezzoStringa) {
  // Converte in numero e formatta con separatore delle migliaia
  return Number(prezzoStringa).toLocaleString('it-IT');
}

</script>