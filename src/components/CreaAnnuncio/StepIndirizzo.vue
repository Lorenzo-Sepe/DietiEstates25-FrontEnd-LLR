<template>
  <div class="p-fluid ">
    <label for="via">Via</label>
    <InputText id="via" v-model="annuncio.immobile.indirizzo.via" />
    
    <label for="numeroCivico">Numero Civico</label>
    <InputText id="numeroCivico" v-model="annuncio.immobile.indirizzo.numeroCivico" />
    
    <label for="cap">CAP</label>
    <InputText id="cap" v-model="annuncio.immobile.indirizzo.cap" />
    
    <label for="citta">Città</label>
    <InputText id="citta" v-model="annuncio.immobile.indirizzo.citta" />
  </div>
  
  <div class="map-container">
    <MapComponent 
      :activeStep="activeStep" 
      :via="annuncio.immobile.indirizzo.via" 
      :numeroCivico="annuncio.immobile.indirizzo.numeroCivico" 
      :cap="annuncio.immobile.indirizzo.cap" 
      :citta="annuncio.immobile.indirizzo.citta"
    />
    </div>
  
  <div class="flex pt-6 justify-between">
    <Button label="Indietro" severity="secondary" icon="pi pi-arrow-left" @click="$emit('indietro')" />
    <Button label="Avanti" icon="pi pi-arrow-right" iconPos="right" @click="$emit('avanti')" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import MapComponent from './MapComponent.vue'; 
import { AnnuncioImmobiliareRequest } from '../../dto/RequestAnnuncio';

// Define props and emits
const props = defineProps({
  annuncio: AnnuncioImmobiliareRequest,
  activeStep: Number
});
const emit = defineEmits(['indietro', 'avanti']);
</script>