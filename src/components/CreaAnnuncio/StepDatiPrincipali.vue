<script setup>
import { defineProps, defineEmits, defineExpose, reactive, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { AnnuncioImmobiliareRequest } from '../../dto/RequestAnnuncio';

const props = defineProps({
  annuncio: AnnuncioImmobiliareRequest,
  tentativoInvio: Boolean
});

const errori = reactive({
  prezzo: { invalid: false, messaggio: '' },
  mutuoEstinto: { invalid: false, messaggio: '' },
  metriQuadri: { invalid: false, messaggio: '' },
  numeroDiPiani: { invalid: false, messaggio: '' },
  numeroStanze: { invalid: false, messaggio: '' },
  numeroServizi: { invalid: false, messaggio: '' },
  classeEnergetica: { invalid: false, messaggio: 'Seleziona una classe energetica' }
});

const opzioniClasseEnergetica = reactive([
  { label: 'A+', value: 'A+' },
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
  { label: 'E', value: 'E' },
  { label: 'F', value: 'F' },
  { label: 'G', value: 'G' }
]);

// Funzione di validazione
const verificaDati = (campo) => {
  if (campo === 'prezzo') {
    const prezzo = props.annuncio.prezzo || 0;
    if (prezzo <= 0) {
      errori.prezzo.invalid = true;
      errori.prezzo.messaggio = 'Il prezzo deve essere maggiore di zero';
    } else {
      errori.prezzo.invalid = false;
      errori.prezzo.messaggio = '';
    }
  } else if (campo === 'metriQuadri') {
    const metriQuadri = props.annuncio.metriQuadri || 0;
    if (metriQuadri <= 0) {
      errori.metriQuadri.invalid = true;
      errori.metriQuadri.messaggio = 'I metri quadri devono essere un valore positivo';
    } else {
      errori.metriQuadri.invalid = false;
      errori.metriQuadri.messaggio = '';
    }
  } else if (campo === 'numeroDiPiani') {
    const numeroDiPiani = props.annuncio.numeroDiPiani || 0;
    if (numeroDiPiani <= 0) {
      errori.numeroDiPiani.invalid = true;
      errori.numeroDiPiani.messaggio = 'Il numero di piani deve essere almeno 1';
    } else {
      errori.numeroDiPiani.invalid = false;
      errori.numeroDiPiani.messaggio = '';
    }
  } else if (campo === 'numeroStanze') {
    const numeroStanze = props.annuncio.numeroStanze || 0;
    if (numeroStanze <= 0) {
      errori.numeroStanze.invalid = true;
      errori.numeroStanze.messaggio = 'Il numero di stanze deve essere almeno 1';
    } else {
      errori.numeroStanze.invalid = false;
      errori.numeroStanze.messaggio = '';
    }
  } else if (campo === 'numeroServizi') {
    const numeroServizi = props.annuncio.numeroServizi || 0;
    if (numeroServizi <= 0) {
      errori.numeroServizi.invalid = true;
      errori.numeroServizi.messaggio = 'Il numero di servizi deve essere almeno 1';
    } else {
      errori.numeroServizi.invalid = false;
      errori.numeroServizi.messaggio = '';
    }
  } else if (campo === 'classeEnergetica') {
    errori.classeEnergetica.invalid = !props.annuncio.classeEnergetica;
  }
};

const validaCampi = () => {
  ['prezzo', 'metriQuadri', 'numeroDiPiani', 'numeroStanze', 'numeroServizi', 'classeEnergetica'].forEach(campo => verificaDati(campo));
  return !Object.values(errori).some(e => e.invalid);
};

const validaEAvanza = () => {
  validaCampi();
  if (!Object.values(errori).some(e => e.invalid)) {
    emit('avanti');
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

<template>
  <div>
    <Message v-if="hasErrori && tentativoInvio" severity="error" variant="filled" class="mb-4 text-left">
      <p>Alcuni campi non sono corretti. Verifica e correggi i seguenti campi evidenziati in rosso:</p>
      <ul class="list-disc pl-5">
        <li v-if="errori.prezzo.invalid">Prezzo</li>
        <li v-if="errori.metriQuadri.invalid">Metri Quadrati</li>
        <li v-if="errori.numeroDiPiani.invalid">Numero di Piani</li>
        <li v-if="errori.numeroStanze.invalid">Numero di Stanze</li>
        <li v-if="errori.numeroServizi.invalid">Numero di Servizi</li>
        <li v-if="errori.classeEnergetica.invalid">Classe Energetica</li>
      </ul>
    </Message>

    <div class="flex flex-col">
      <label for="prezzo" class="font-semibold">Prezzo</label>
      <InputText 
        id="prezzo" 
        v-model="annuncio.prezzo" 
        type="number"
        :invalid="errori.prezzo.invalid" 
        @input="verificaDati('prezzo')" 
        @blur="verificaDati('prezzo')" 
        class="border rounded p-2"
      />
      <Message v-if="errori.prezzo.invalid" severity="error" variant="simple" size="small">{{ errori.prezzo.messaggio }}</Message>

      <label for="metriQuadri" class="font-semibold">Metri Quadri</label>
      <InputText 
        id="metriQuadri" 
        v-model="annuncio.metriQuadri" 
        type="number"
        :invalid="errori.metriQuadri.invalid" 
        @input="verificaDati('metriQuadri')" 
        @blur="verificaDati('metriQuadri')" 
        class="border rounded p-2"
      />
      <Message v-if="errori.metriQuadri.invalid" severity="error" variant="simple" size="small">{{ errori.metriQuadri.messaggio }}</Message>

      <label for="numeroDiPiani" class="font-semibold">Numero di Piani</label>
      <InputText 
        id="numeroDiPiani" 
        v-model="annuncio.numeroDiPiani" 
        type="number"
        :invalid="errori.numeroDiPiani.invalid" 
        @input="verificaDati('numeroDiPiani')" 
        @blur="verificaDati('numeroDiPiani')" 
        class="border rounded p-2"
      />
      <Message v-if="errori.numeroDiPiani.invalid" severity="error" variant="simple" size="small">{{ errori.numeroDiPiani.messaggio }}</Message>

      <label for="numeroStanze" class="font-semibold">Numero di Stanze</label>
      <InputText 
        id="numeroStanze" 
        v-model="annuncio.numeroStanze" 
        type="number"
        :invalid="errori.numeroStanze.invalid" 
        @input="verificaDati('numeroStanze')" 
        @blur="verificaDati('numeroStanze')" 
        class="border rounded p-2"
      />
      <Message v-if="errori.numeroStanze.invalid" severity="error" variant="simple" size="small">{{ errori.numeroStanze.messaggio }}</Message>

      <label for="numeroServizi" class="font-semibold">Numero di Servizi</label>
      <InputText 
        id="numeroServizi" 
        v-model="annuncio.numeroServizi" 
        type="number"
        :invalid="errori.numeroServizi.invalid" 
        @input="verificaDati('numeroServizi')" 
        @blur="verificaDati('numeroServizi')" 
        class="border rounded p-2"
      />
      <Message v-if="errori.numeroServizi.invalid" severity="error" variant="simple" size="small">{{ errori.numeroServizi.messaggio }}</Message>

      <label for="classeEnergetica" class="font-semibold">Classe Energetica</label>
      <Select 
        id="classeEnergetica" 
        v-model="annuncio.classeEnergetica" 
        :options="opzioniClasseEnergetica" 
        optionLabel="label"
        optionValue="value"
        placeholder="Seleziona la classe energetica"
        :invalid="errori.classeEnergetica.invalid"
        @blur="verificaDati('classeEnergetica')" 
        @change="verificaDati('classeEnergetica')" 
        class="border rounded p-2"
      />
      <Message v-if="errori.classeEnergetica.invalid" severity="error" variant="simple" size="small">{{ errori.classeEnergetica.messaggio }}</Message>
    </div>

    <div class="flex justify-end pt-6">
      <Button label="Avanti" icon="pi pi-arrow-right" iconPos="right" @click="validaEAvanza" />
    </div>
  </div>
</template>
