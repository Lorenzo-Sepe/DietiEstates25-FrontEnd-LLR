<template>
    <Select
    class="w-full"
      v-model="capSelezionato"
      :options="listaComuni"
      :optionLabel="etichettaOpzione"
      filter
      filterBy="cap"              
      filterPlaceholder="Cerca un CAP"
      :virtualScrollerOptions="opzioniScrollerVirtuale"
      placeholder="Seleziona un CAP"
      @update:modelValue="aggiornaIndirizzo"
    />
</template>

<script setup>
import { ref, defineModel } from 'vue';
import Select from 'primevue/select';
import datiComuni from '../../assets/comuniCap.json';
import { Indirizzo } from '../../dto/RequestAnnuncio';

// Riceviamo l'oggetto indirizzo dal padre tramite v-model
const indirizzo = defineModel('comune');

// Lista dei comuni dal JSON
const listaComuni = ref(datiComuni);

// Per visualizzare il CAP e, eventualmente, altre info (non serve che il filtro sia su queste info)
const etichettaOpzione = (comune) => `CAP: ${comune.cap} - ${comune.denominazione_ita} (${comune.sigla_provincia})`;

// Configurazione dello scrolling virtuale
const opzioniScrollerVirtuale = {
  itemSize: 40,
  delay: 0
};

// Per tenere traccia del CAP selezionato (il v-model è legato al campo CAP anziché all'intero indirizzo)
const capSelezionato = ref(null);

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


