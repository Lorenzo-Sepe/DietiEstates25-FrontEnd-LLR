<template>
    <Select
    class="w-full"
      v-model="capSelezionato"
      :options="listaComuni"
      :optionLabel="etichettaOpzione"
      filter
      filterBy="cap"              
      filterPlaceholder="Digita per cercare"
      :virtualScrollerOptions="opzioniScrollerVirtuale"
      placeholder="Seleziona una Comune"
      @update:modelValue="aggiornaIndirizzo"
    />
</template>

<script setup>
import { ref, defineModel ,defineProps} from 'vue';
import Select from 'primevue/select';
import datiComuni from '../../assets/comuniCap.json';

import { Indirizzo } from '../../dto/RequestAnnuncio';
const props = defineProps({
  comune: Indirizzo,
});

// Riceviamo l'oggetto indirizzo dal padre tramite v-model
const indirizzo = defineModel('comune');

// Lista dei comuni dal JSON
const listaComuni = ref(datiComuni);

// Per visualizzare il CAP e, eventualmente, altre info (non serve che il filtro sia su queste info)
const etichettaOpzione = (comune) => `${comune.denominazione_ita} (${comune.sigla_provincia}) CAP:${comune.cap}`;

// Configurazione dello scrolling virtuale
const opzioniScrollerVirtuale = {
  itemSize: 40,
  delay: 0
};

// Per tenere traccia del CAP selezionato (il v-model è legato al campo CAP anziché all'intero indirizzo)
const capSelezionato = ref(null);


// Imposta il valore iniziale di capSelezionato in base al prop comune
if (props.comune.cap) {
  const record = listaComuni.value.find(comune => comune.cap === props.comune.cap);
  if (record) {
    capSelezionato.value = record; // Imposta l'oggetto completo
  }
}
// Quando l'utente seleziona un CAP, cerchiamo il record completo
const aggiornaIndirizzo = (capSelezionatoVal) => {
  // Trova nel JSON il record corrispondente al CAP
  const record = listaComuni.value.find(comune => comune.cap === capSelezionatoVal.cap || comune.cap === capSelezionatoVal);
  if (record && indirizzo.value) {
    // Utilizziamo Object.assign per aggiornare l'oggetto mantenendo via e numero civico
    Object.assign(indirizzo.value, {
      citta: record.denominazione_ita,
      cap: record.cap,
      provincia: record.sigla_provincia,
      latitudine: parseFloat(record.latitudine),
      longitudine: parseFloat(record.longitudine),
      nazione: "Italia"
    });
  }
};
</script>


