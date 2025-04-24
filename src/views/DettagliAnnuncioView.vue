<template>

  <DettagliAnnuncio :annuncio="annuncioResponse" :propostaRequest="propostaRequest"
    @inviaNuovaProposta="inviaNuovaProposta" />

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { AnnuncioImmobiliareResponse } from '../dto/Response/AnnuncioImmobiliareResponse.js';
import { PropostaRequest } from './../dto/PropostaRequest.js';

import AnnunciImmobiliService from '../services/AnnunciImmobiliService.js';
import PropostaService from '../services/PropostaService.js';

import DettagliAnnuncio from '../components/DettaglioAnnuncio/DettaglioAnnuncio.vue';

const route = useRoute();

const annuncioResponse = ref(null);
const propostaRequest = reactive(new PropostaRequest());

onMounted(async () => {

  const response = await AnnunciImmobiliService.getAnnuncioImmobiliare(route.params.id);
  annuncioResponse.value = new AnnuncioImmobiliareResponse(response)
  console.log('response:', response.value);

});

const inviaNuovaProposta = async () => {

  propostaRequest.annuncioId = route.params.id;
  console.log("emit emesso:::::", propostaRequest)

  try {

    await PropostaService.inviaNuovaProposta(propostaRequest)
    console.log('Proposta inviata con successo:');

  } catch (error) {
    console.error('Errore durante l\'invio della proposta:', error);
  }

}



</script>