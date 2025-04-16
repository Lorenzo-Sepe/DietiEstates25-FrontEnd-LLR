<template>

  <div v-if="annuncioResponse" class="w-full h-full flex felx-col gap-2 md:flex-row bg-gray-100">

    <div class="area-annuncio w-full md:w-[90%] lg:w-[50%] flex flex-col gap-2 mx-auto">

      <div class="intestazione-schemi-piccoli w-full p-2 block lg:hidden">
        <Button label="Mostra contatti agenti" @click="mostraDialogCardAgente=true" />
        <Dialog v-model:visible="mostraDialogCardAgente" modal header="Contatti agente" :style="{ width: '100%' }"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
          <CardContattiAgente />
        </Dialog>
      </div>

      <div class="area-foto w-full p-8 bg-white">
        <Galleria :immagini="annuncioResponse.immobile.immagini" />
      </div>

      <div class="info-principali w-full flex flex-col p-2 items-start bg-white gap-2">
        <Tag value="Primary">{{ annuncioResponse.contratto.tipoContratto }}</Tag>
        <span class="titolo text-4xl font-bold text-left">{{ annuncioResponse.titolo }}</span>
        <span class="indirizzo text-lg text-left">{{ annuncioResponse.immobile.indirizzo.via }}, {{
          annuncioResponse.immobile.indirizzo.numeroCivico }} - {{ annuncioResponse.immobile.indirizzo.citta }} - {{
            annuncioResponse.immobile.indirizzo.cap }}</span>
        <span v-if="annuncioResponse.contratto.tipoContratto == 'AFFITTO'"
          class="indirizzo text-3xl text-left font-bold">{{
            formattaPrezzo(annuncioResponse.contratto.contrattoAffittoResponse.prezzoAffitto) }} € /mese</span>
        <span v-else class="indirizzo text-3xl text-left font-bold">{{
          formattaPrezzo(annuncioResponse.contratto.contrattoVenditaResponse.prezzoVendita) }} €</span>

      </div>

      <div class="accordions w-full flex flex-col p-2 items-start bg-white">

        <Accordion value="0" class="accordiations w-full">

          <AccordionPanel value="0" class="descrizione">
            <AccordionHeader>DESCRIZIONE</AccordionHeader>
            <AccordionContent>
              <span class="text-left text-xl">
                {{ annuncioResponse.descrizione }}
              </span>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="1" class="caratteristiche mt-2">
            <AccordionHeader>CARATTERSTICHE IMMOBILE</AccordionHeader>
            <AccordionContent>
              <div class="flex flex-col gap-2">
                <span>carattertica 1</span>
                <span>carattertica 2</span>
                <span>carattertica 3</span>
              </div>
            </AccordionContent>
          </AccordionPanel>


        </Accordion>


      </div>

    </div>

    <div class="area-contatti-agente w-[40%] flex flex-col gap-2 mx-auto hidden lg:block p-2">
      <CardContattiAgente />
    </div>

  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { AnnuncioImmobiliareResponse } from '../dto/Response/AnnuncioImmobiliareResponse.js';
import AnnunciImmobiliService from '../services/AnnunciImmobiliService.js';

import Galleria from '../components/DettaglioAnnuncio/Galleria.vue';
import CardContattiAgente from '../components/DettaglioAnnuncio/CardContattiAgente.vue';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const route = useRoute();

const annuncioResponse = ref(null);
const mostraDialogCardAgente = ref(false);


onMounted(async () => {

  const annuncio = await AnnunciImmobiliService.getAnnuncioImmobiliare(route.params.id);
  annuncioResponse.value = new AnnuncioImmobiliareResponse(annuncio)

});

function formattaPrezzo(prezzoStringa) {
  // Converte in numero e formatta con separatore delle migliaia
  return Number(prezzoStringa).toLocaleString('it-IT');
}

</script>