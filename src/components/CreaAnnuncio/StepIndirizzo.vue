<template>

  <div>

    <div class="flex flex-col gap-4">

      <div class="flex flex-col">
        <label for="via">Via</label>
        <InputText id="via" v-model="annuncio.immobile.indirizzo.via" />
      </div>

      <div class="flex flex-col">
        <label for="numeroCivico">Numero Civico</label>
        <InputText id="numeroCivico" v-model="annuncio.immobile.indirizzo.numeroCivico" />
      </div>


      <div class="flex flex-col">
        <label for="cap">CAP</label>
        <InputText id="cap" v-model="annuncio.immobile.indirizzo.cap" disabled />
        <SelectComuni class="w-full" v-model:comune="annuncio.immobile.indirizzo" />
      </div>

    </div>


    <div class="flex flex-col gap-1 border my-4 p-2">
      <p><strong>Via:</strong> {{ annuncio.immobile.indirizzo.via }} {{ annuncio.immobile.indirizzo.numeroCivico }}</p>
      <p><strong>CAP:</strong> {{ annuncio.immobile.indirizzo.cap }}</p>
      <p><strong>Provincia:</strong> {{ annuncio.immobile.indirizzo.provincia }}</p>
      <p><strong>Città:</strong> {{ annuncio.immobile.indirizzo.citta }}</p>
      <p><strong>Nazione:</strong> {{ annuncio.immobile.indirizzo.nazione }}</p>
      <p><strong>Latitudine:</strong> {{ annuncio.immobile.indirizzo.latitudine }}</p>
      <p><strong>Longitudine:</strong> {{ annuncio.immobile.indirizzo.longitudine }}</p>
    </div>

    <div class="map-container">
      <MapComponent :activeStep="activeStep" :via="annuncio.immobile.indirizzo.via"
        :numeroCivico="annuncio.immobile.indirizzo.numeroCivico" :cap="annuncio.immobile.indirizzo.cap"
        :citta="annuncio.immobile.indirizzo.citta" />
    </div>

    <div class="flex pt-6 justify-between">
      <Button label="Indietro" severity="secondary" icon="pi pi-arrow-left" @click="$emit('indietro')" />
      <Button label="Avanti" icon="pi pi-arrow-right" iconPos="right" @click="$emit('avanti')" />
    </div>

  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import MapComponent from './MapComponent.vue';
import { AnnuncioImmobiliareRequest } from '../../dto/RequestAnnuncio';
import SelectComuni from './SelectComuni.vue';
const props = defineProps({
  annuncio: AnnuncioImmobiliareRequest,
  activeStep: Number
});
const emit = defineEmits(['indietro', 'avanti']);



</script>
