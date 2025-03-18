<template>
  <div class="p-fluid">
    <label for="via">Via</label>
    <InputText id="via" v-model="annuncio.immobile.indirizzo.via" />
    
    <label for="citta">Città</label>
    <InputText id="citta" v-model="annuncio.immobile.indirizzo.citta" />
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

const props = defineProps({ annuncio: Object });
const emit = defineEmits(['indietro', 'avanti']);
</script>

<style scoped>
.p-fluid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
