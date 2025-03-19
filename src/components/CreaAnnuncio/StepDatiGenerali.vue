<template>
  <div class="p-fluid">
    <label for="titolo">Titolo</label>
    <InputText id="titolo" v-model="annuncio.titolo" :invalid="errori.titolo.invalid" @input="controllaTitolo" @blur="controllaTitolo" />
    <Message v-if="errori.titolo.invalid" severity="error" variant="simple" size="small">{{ errori.titolo.messaggio }}</Message>

    <label for="descrizione">Descrizione</label>
    <Textarea id="descrizione" v-model="annuncio.descrizione" rows="4" :invalid="errori.descrizione.invalid" @input="controllaDescrizione" @blur="controllaDescrizione" />
    <Message v-if="errori.descrizione.invalid" severity="error" variant="simple" size="small">{{ errori.descrizione.messaggio }}</Message>

    <label for="tipoContratto">Tipo di Contratto</label>
    <Select 
      id="tipoContratto" 
      v-model="annuncio.contratto.tipoDiContratto" 
      :options="opzioniContratto" 
      optionLabel="label"
      optionValue="value"
      placeholder="Seleziona il contratto"
      :invalid="errori.contratto.invalid"
      @blur="controllaContratto"
    />
    <Message v-if="errori.contratto.invalid" severity="error" variant="simple" size="small">{{ errori.contratto.messaggio }}</Message>

    <label for="tipologiaImmobile">Tipologia di Immobile</label>
    <Select 
      id="tipologiaImmobile" 
      v-model="annuncio.immobile.tipologiaImmobile" 
      :options="opzioniTipologia"
      optionLabel="label"
      optionValue="value"
      placeholder="Seleziona la tipologia"
      :invalid="errori.tipologia.invalid"
      @blur="controllaTipologia"
    />
    <Message v-if="errori.tipologia.invalid" severity="error" variant="simple" size="small">{{ errori.tipologia.messaggio }}</Message>
  </div>

  <div class="flex pt-6 justify-end">
    <Button label="Avanti" icon="pi pi-arrow-right" iconPos="right" @click="validaEAvanza" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, ref } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { AnnuncioImmobiliareRequest } from '../../dto/RequestAnnuncio';

const props = defineProps({ annuncio: AnnuncioImmobiliareRequest });
const emit = defineEmits(['avanti']);

// Stato per il controllo della prima volta
const primaVoltaContratto = ref(true);
const primaVoltaTipologia = ref(true);

// Stato per il controllo degli errori
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

const controllaTitolo = () => {
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
};

const controllaDescrizione = () => {
  const descrizione = props.annuncio.descrizione?.trim() || '';
  if(descrizione.length === 0){
    errori.descrizione.invalid = true;
    errori.descrizione.messaggio = 'La descrizione è obbligatoria'; 
  }
  else if(descrizione.length < 20){
  errori.descrizione.invalid = true;
  errori.descrizione.messaggio = 'La descrizione deve essere di almeno 20 caratteri';
  }else{
    errori.descrizione.invalid = false;
    errori.descrizione.messaggio = '';
  }  
};

const controllaContratto = () => {
  if (primaVoltaContratto.value) {
    primaVoltaContratto.value = false;
    setTimeout(() => {
      errori.contratto.invalid = !props.annuncio.contratto.tipoDiContratto;
    }, 400);
  }else{
    errori.contratto.invalid = !props.annuncio.contratto.tipoDiContratto;
  }
  
};

const controllaTipologia = () => {
  if(primaVoltaTipologia.value){
    primaVoltaTipologia.value = false;
    setTimeout(() => {
      errori.tipologia.invalid = !props.annuncio.immobile.tipologiaImmobile;
    }, 400);
  }else{
    errori.tipologia.invalid = !props.annuncio.immobile.tipologiaImmobile;
  }
};

function validaCampi() {

  controllaTitolo();
  controllaDescrizione();
  primaVoltaContratto.value = false;
  controllaContratto();
  primaVoltaTipologia.value = false;
  controllaTipologia();
}

const validaEAvanza = () => {
  validaCampi();


  if (!errori.titolo.invalid && !errori.descrizione.invalid && !errori.contratto.invalid && !errori.tipologia.invalid) {
    emit('avanti');
  }
};
</script>

<style scoped>
.p-fluid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>