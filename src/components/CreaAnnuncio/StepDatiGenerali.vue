<script setup>
import { defineProps, defineEmits, defineExpose, reactive, computed, watch } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { AnnuncioImmobiliareRequest } from '../../dto/RequestAnnuncio';

const emit = defineEmits([ 'avanti']);

const props = defineProps({ 
  annuncio: AnnuncioImmobiliareRequest,
  tentativoInvio: Boolean
});

const errori = reactive({
  titolo: { invalid: false, messaggio: '' },
  descrizione: { invalid: false, messaggio: '' },
  contratto: { invalid: false, messaggio: 'Seleziona un tipo di contratto' },
  tipologia: { invalid: false, messaggio: 'Seleziona una tipologia di immobile' }
});

const opzioniContratto = reactive([
  { label: 'Affitto', value: 'AFFITTO' },
  { label: 'Vendita', value: 'VENDITA' }
]);

const opzioniTipologia = reactive([
  { label: 'Terreno', value: 'TERRENO' },
  { label: 'Appartamento', value: 'APPARTAMENTO' },
  { label: 'Ufficio', value: 'UFFICIO' },
  { label: 'Posto Auto', value: 'POSTOAUTO' },
  { label: 'Altro', value: 'ALTRO' }
]);

// Funzione di validazione
const verificaDati = (campo) => {
  if (campo === 'titolo') {
    const titolo = props.annuncio.titolo?.trim() || '';
    if (titolo.length === 0) {
      errori.titolo.invalid = true;
      errori.titolo.messaggio = 'Il titolo è obbligatorio';
    } else if (titolo.length < 5) {
      errori.titolo.invalid = true;
      errori.titolo.messaggio = 'Il titolo deve essere di almeno 5 caratteri';
    } else if (titolo.length > 100) {
      errori.titolo.invalid = true;
      errori.titolo.messaggio = 'Il titolo deve essere di massimo 100 caratteri';
    } else {
      errori.titolo.invalid = false;
      errori.titolo.messaggio = '';
    }
  } else if (campo === 'descrizione') {
    const descrizione = props.annuncio.descrizione?.trim() || '';
    if (descrizione.length === 0) {
      errori.descrizione.invalid = true;
      errori.descrizione.messaggio = 'La descrizione è obbligatoria'; 
    } else if (descrizione.length < 20) {
      errori.descrizione.invalid = true;
      errori.descrizione.messaggio = 'La descrizione deve essere di almeno 20 caratteri';
    } else {
      errori.descrizione.invalid = false;
      errori.descrizione.messaggio = '';
    }  
  } else if (campo === 'contratto') {
    errori.contratto.invalid = !props.annuncio.contratto.tipoDiContratto;
  } else if (campo === 'tipologia') {
    errori.tipologia.invalid = !props.annuncio.immobile.tipologiaImmobile;
  }
};

const validaCampi = () => {
  ['titolo', 'descrizione', 'contratto', 'tipologia'].forEach(campo => verificaDati(campo));
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
        <li v-if="errori.titolo.invalid">Titolo</li>
        <li v-if="errori.descrizione.invalid">Descrizione</li>
        <li v-if="errori.contratto.invalid">Tipo di Contratto</li>
        <li v-if="errori.tipologia.invalid">Tipologia di Immobile</li>
      </ul>
    </Message>
    
    <div class="flex flex-col">
      <label for="titolo" class="font-semibold">Titolo</label>
      <InputText 
        id="titolo" 
        v-model="annuncio.titolo" 
        :invalid="errori.titolo.invalid" 
        @input="verificaDati('titolo')" 
        @blur="verificaDati('titolo')" 
        class="border rounded p-2"
      />
      <Message v-if="errori.titolo.invalid" severity="error" variant="simple" size="small">{{ errori.titolo.messaggio }}</Message>
  
      <label for="descrizione" class="font-semibold">Descrizione</label>
      <Textarea 
        id="descrizione" 
        v-model="annuncio.descrizione" 
        rows="4" 
        :invalid="errori.descrizione.invalid" 
        @input="verificaDati('descrizione')" 
        @blur="verificaDati('descrizione')" 
        class="border rounded p-2"
      />
      <Message v-if="errori.descrizione.invalid" severity="error" variant="simple" size="small">{{ errori.descrizione.messaggio }}</Message>
  
      <label for="tipoContratto" class="font-semibold">Tipo di Contratto</label>
      <Select 
        id="tipoContratto" 
        v-model="annuncio.contratto.tipoDiContratto" 
        :options="opzioniContratto" 
        optionLabel="label"
        optionValue="value"
        placeholder="Seleziona il contratto"
        :invalid="errori.contratto.invalid"
        @blur="verificaDati('contratto')"
        @change="verificaDati('contratto')"
        class="border rounded p-2"
      />
      <Message v-if="errori.contratto.invalid" severity="error" variant="simple" size="small">{{ errori.contratto.messaggio }}</Message>
  
      <label for="tipologiaImmobile" class="font-semibold">Tipologia di Immobile</label>
      <Select 
        id="tipologiaImmobile" 
        v-model="annuncio.immobile.tipologiaImmobile" 
        :options="opzioniTipologia"
        optionLabel="label"
        optionValue="value"
        placeholder="Seleziona la tipologia"
        :invalid="errori.tipologia.invalid"
        @blur="verificaDati('tipologia')"
        @change="verificaDati('tipologia')"
        class="border rounded p-2"
      />
      <Message v-if="errori.tipologia.invalid" severity="error" variant="simple" size="small">{{ errori.tipologia.messaggio }}</Message>
    </div>
  
    <div class="flex justify-end pt-6">
      <Button label="Avanti" icon="pi pi-arrow-right" iconPos="right" @click="validaEAvanza" />
    </div>

  </div>
</template>
