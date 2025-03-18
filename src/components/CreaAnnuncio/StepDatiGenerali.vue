<template>
  <div class="p-fluid">
    <label for="titolo">Titolo</label>
    <InputText id="titolo" v-model="annuncio.titolo" />
    
    <label for="descrizione">Descrizione</label>
    <Textarea id="descrizione" v-model="annuncio.descrizione" rows="4" />
  </div>
 
  <div class="flex pt-6 justify-end">
    <Button label="Avanti" icon="pi pi-arrow-right" iconPos="right" @click="$emit('avanti')" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import { AnnuncioImmobiliareRequest } from '../../dto/RequestAnnuncio';

const props = defineProps({ annuncio: AnnuncioImmobiliareRequest });
const emit = defineEmits(['avanti']);
</script>

<style scoped>
.p-fluid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>    