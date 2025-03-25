<script setup>
import { defineProps, reactive } from 'vue';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { Contratto } from '../../dto/RequestAnnuncio';

const props = defineProps({
  contratto: Contratto,
});

const errori = reactive({
  prezzo: { invalid: false, messaggio: '' },
  caparra: { invalid: false, messaggio: '' },
  tempoMinimo: { invalid: false, messaggio: '' },
  tempoMassimo: { invalid: false, messaggio: '' },
  mutuoEstinto: { invalid: false, messaggio: '' }
});

const opzioniContratto = [
  { label: 'Affitto', value: 'AFFITTO' },
  { label: 'Vendita', value: 'VENDITA' }
];

const verificaDati = (campo) => {
  if (props.contratto.tipoDiContratto === 'AFFITTO') {
    if (campo === 'prezzo') {
      const prezzo = props.contratto.datiAffittoRequest.prezzo || 0;
      errori.prezzo.invalid = prezzo <= 0;
      errori.prezzo.messaggio = prezzo <= 0 ? 'Il prezzo deve essere maggiore di zero' : '';
    }
    if (campo === 'caparra') {
      const caparra = props.contratto.datiAffittoRequest.caparra || 0;
      errori.caparra.invalid = caparra < 0;
      errori.caparra.messaggio = caparra < 0 ? 'La caparra non può essere negativa' : '';
    }
    if (campo === 'tempoMinimo') {
      const tempoMinimo = props.contratto.datiAffittoRequest.tempoMinimo || 0;
      errori.tempoMinimo.invalid = tempoMinimo <= 0;
      errori.tempoMinimo.messaggio = tempoMinimo <= 0 ? 'Il tempo minimo deve essere maggiore di zero' : '';
    }
  } else if (props.contratto.tipoDiContratto === 'VENDITA') {
    if (campo === 'prezzo') {
      const prezzo = props.contratto.datiVenditaRequest.prezzo || 0;
      errori.prezzo.invalid = prezzo <= 0;
      errori.prezzo.messaggio = prezzo <= 0 ? 'Il prezzo deve essere maggiore di zero' : '';
    }
  }
};

const validaCampi = () => {
  if (props.contratto.tipoDiContratto === 'AFFITTO') {
    ['prezzo', 'caparra', 'tempoMinimo'].forEach(campo => verificaDati(campo));
  } else if (props.contratto.tipoDiContratto === 'VENDITA') {
    ['prezzo'].forEach(campo => verificaDati(campo));
  }
  return !Object.values(errori).some(e => e.invalid);
};

const hasErrori = () => Object.values(errori).some(e => e.invalid);

defineExpose({
  validaCampi,
  hasErrori
});
</script>

<template>
  <div>
    <label for="tipoContratto" class="font-semibold">Tipo di Contratto</label>
    <Select 
      id="tipoContratto" 
      v-model="contratto.tipoDiContratto" 
      :options="opzioniContratto" 
      optionLabel="label"
      optionValue="value"
      placeholder="Seleziona il tipo di contratto"
      class="border rounded p-2"
    />

    <div v-if="contratto.tipoDiContratto === 'AFFITTO'">
      <label for="prezzoAffitto" class="font-semibold">Prezzo di Affitto</label>
      <InputText 
        id="prezzoAffitto" 
        v-model="contratto.datiAffittoRequest.prezzo" 
        type="number"
        :invalid="errori.prezzo.invalid" 
        @input="verificaDati('prezzo')" 
        @blur="verificaDati('prezzo')" 
      />
      <Message v-if="errori.prezzo.invalid" severity="error">{{ errori.prezzo.messaggio }}</Message>
    
      <label for="caparra" class="font-semibold">Caparra</label>
      <InputText 
        id="caparra" 
        v-model="contratto.datiAffittoRequest.caparra" 
        type="number"
        :invalid="errori.caparra.invalid" 
        @input="verificaDati('caparra')" 
        @blur="verificaDati('caparra')" 
      />
      <Message v-if="errori.caparra.invalid" severity="error">{{ errori.caparra.messaggio }}</Message>
    </div>

    <div v-if="contratto.tipoDiContratto === 'VENDITA'">
      <label for="prezzoVendita" class="font-semibold">Prezzo di Vendita</label>
      <InputText 
        id="prezzoVendita" 
        v-model="contratto.datiVenditaRequest.prezzo" 
        type="number"
        :invalid="errori.prezzo.invalid" 
        @input="verificaDati('prezzo')" 
        @blur="verificaDati('prezzo')" 
      />
      <Message v-if="errori.prezzo.invalid" severity="error">{{ errori.prezzo.messaggio }}</Message>
    </div>

    <div class="flex justify-end pt-6">
      <Button label="Avanti" icon="pi pi-arrow-right" iconPos="right" @click="validaEAvanza" />
    </div>
  </div>
</template>
