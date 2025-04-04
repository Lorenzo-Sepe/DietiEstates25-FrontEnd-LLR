<template>
  <div>
    <Message v-if="hasErrori && tentativoInvio" severity="error" variant="filled" class="mb-4 text-left">
      <p>Alcuni campi non sono corretti. Verifica e correggi i seguenti campi evidenziati in rosso:</p>
      <ul class="list-disc pl-5">
        <li v-if="errori.via.invalid">Via</li>
        <li v-if="errori.numeroCivico.invalid">Numero Civico</li>
        <li v-if="errori.comune.invalid">Città</li>
      </ul>
    </Message>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col">
        <label for="via">Via</label>
        <InputText id="via" v-model="annuncio.immobile.indirizzo.via" :invalid="errori.via.invalid"
          @input="verificaDati('via')" @blur="verificaDati('via')" />
        <Message v-if="errori.via.invalid" severity="error" variant="simple" size="small">{{ errori.via.messaggio }}</Message>
      </div>

      <div class="flex flex-col">
        <label for="numeroCivico">Numero Civico</label>
        <InputText id="numeroCivico" v-model="annuncio.immobile.indirizzo.numeroCivico" :invalid="errori.numeroCivico.invalid"
          @input="verificaDati('numeroCivico')" @blur="verificaDati('numeroCivico')" />
        <Message v-if="errori.numeroCivico.invalid" severity="error" variant="simple" size="small">{{ errori.numeroCivico.messaggio }}</Message>
      </div>

      <div class="flex flex-col">
        <label for="cap">Città</label>
        <SelectComuni class="w-full" v-model:comune="annuncio.immobile.indirizzo" :invalid="errori.comune.invalid"
          @blur="verificaDati('comune')" @change="verificaDati('comune')" />
        <Message v-if="errori.comune.invalid" severity="error" variant="simple" size="small">{{ errori.comune.messaggio }}</Message>
      </div>
    </div>

    <div class="map-container">
      <MapComponent :activeStep="activeStep" :via="annuncio.immobile.indirizzo.via"
        :numeroCivico="annuncio.immobile.indirizzo.numeroCivico" :cap="annuncio.immobile.indirizzo.cap"
        :Indirizzo="annuncio.immobile.indirizzo"
        :citta="annuncio.immobile.indirizzo.citta" />
    </div>

    <div class="flex pt-6 justify-between">
      <Button label="Indietro" severity="secondary" icon="pi pi-arrow-left" @click="$emit('indietro')" />
      <Button label="Avanti" icon="pi pi-arrow-right" iconPos="right" @click="validaEAvanza" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, defineExpose,reactive, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import MapComponent from './MapComponent.vue';
import { AnnuncioImmobiliareRequest } from '../../dto/RequestAnnuncio';
import SelectComuni from './SelectComuni.vue';
import { scrollToFirstError } from '../../utils/scrollToError';
const props = defineProps({
  annuncio: AnnuncioImmobiliareRequest,
  activeStep: Number,
  tentativoInvio: Boolean
});
const emit = defineEmits(['indietro', 'avanti']);

const errori = reactive({
  via: { invalid: false, messaggio: '' },
  numeroCivico: { invalid: false, messaggio: '' },
  comune: { invalid: false, messaggio: 'Seleziona un comune' }
});

// Funzione di validazione
const verificaDati = (campo) => {
  if (campo === 'via') {
    const via = props.annuncio.immobile.indirizzo.via?.trim() || '';
    if (via.length === 0) {
      errori.via.invalid = true;
      errori.via.messaggio = 'La via è obbligatoria';
    } else {
      errori.via.invalid = false;
      errori.via.messaggio = '';
    }
  } else if (campo === 'numeroCivico') {
    const numeroCivico = props.annuncio.immobile.indirizzo.numeroCivico?.trim() || '';
    if (numeroCivico.length === 0) {
      errori.numeroCivico.invalid = true;
      errori.numeroCivico.messaggio = 'Il numero civico è obbligatorio';
    } else {
      errori.numeroCivico.invalid = false;
      errori.numeroCivico.messaggio = '';
    }
  } else if (campo === 'comune') {
    errori.comune.invalid = !props.annuncio.immobile.indirizzo.citta;
  }
};

const validaCampi = () => {
console.log('validaCampi', props.annuncio.immobile.indirizzo);
  ['via', 'numeroCivico', 'comune'].forEach(campo => verificaDati(campo));
  return !Object.values(errori).some(e => e.invalid);
};

const validaEAvanza = () => {
  validaCampi();
  if (!Object.values(errori).some(e => e.invalid)) {
    emit('avanti');
  } else {
    scrollToFirstError(errori);
  }
};

const hasErrori = computed(() => {
  return Object.values(errori).some(e => e.invalid);
});

// Esponiamo la funzione verificaDati al componente genitore
defineExpose({
  validaCampi,
  hasErrori
});
</script>