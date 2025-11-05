<template>
  <!-------------------------------------------------- SEZIONE ALLERT ------------------------------------------------>

  <Dialog v-model:visible="dialogLoading" header="OPERAZIONE IN CORSO" :closable="false" :style="{ width: '25rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">

    <div class="flex flex-col justify-center">

      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
        aria-label="Custom ProgressSpinner" />

      <p>Attendere prego...</p>

    </div>


  </Dialog>

  <Dialog v-model:visible="dialogConferma" header="" :style="{ width: '25rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <span class="text-xl font-bold">Proposta inviata con successo</span>
    <Button label="OK" class="w-full" @click="refreshPage" />
  </Dialog>

  <Dialog v-model:visible="visible" pt:root:class="!border-0 !bg-white" pt:mask:class="backdrop-blur-sm">
    <template #container="{ closeCallback }">
      <span class="text-xl font-bold">Proposta inviata con successo</span>
      <Button label="OK" class="w-full" @click="refreshPage" />
    </template>
  </Dialog>

  <!--------------------------------------------------- ------------- -------------------------------------------------->

  <DettagliAnnuncio :annuncio="annuncioResponse" :propostaRequest="propostaRequest"
    @inviaNuovaProposta="inviaNuovaProposta" />
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";

import { AnnuncioImmobiliareResponse } from "../dto/Response/AnnuncioImmobiliareResponse.js";
import { PropostaRequest } from "./../dto/PropostaRequest.js";

import AnnunciImmobiliService from "../services/AnnunciImmobiliService.js";
import PropostaService from "../services/PropostaService.js";

import DettagliAnnuncio from "../components/DettaglioAnnuncio/DettaglioAnnuncio.vue";

import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";

const route = useRoute();

const annuncioResponse = ref(null);
const propostaRequest = reactive(new PropostaRequest());

const dialogLoading = ref(false);
const dialogConferma = ref(false);

const visible = ref(false);

onMounted(async () => {

  const response = await AnnunciImmobiliService.getAnnuncioImmobiliare(
    route.params.id,
  );
  annuncioResponse.value = new AnnuncioImmobiliareResponse(response);
});

const inviaNuovaProposta = async () => {

  propostaRequest.annuncioId = route.params.id;
  dialogLoading.value = true;

  try {

    await PropostaService.inviaNuovaProposta(propostaRequest);
    dialogLoading.value = false;
    visible.value = true;

  } catch (error) {

    console.error("Errore durante l'invio della proposta:", error);
    dialogLoading.value = false;
  }
};

const refreshPage = () => {
  window.location.reload();
};
</script>
