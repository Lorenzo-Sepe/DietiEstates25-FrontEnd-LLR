<script setup>
import { defineProps, defineEmits, defineExpose, reactive, computed } from 'vue';
import ToggleSwitch from 'primevue/toggleswitch';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { AnnuncioImmobiliareRequest } from '../../dto/RequestAnnuncio';
const emit = defineEmits(['avanti']);

const props = defineProps({
  annuncio: {
    type: AnnuncioImmobiliareRequest,
    required: true
  },
  tentativoInvio: Boolean
});

const errori = reactive({
  descrizioneAggiuntiva: { invalid: false, messaggio: '' }
});

// Funzione di validazione
const validaCampi = () => {
  const descrizioneAggiuntiva = props.annuncio.immobile.caratteristicheAggiuntive.descrizioneAggiuntiva?.trim() || '';
  if (descrizioneAggiuntiva.length > 200) {
    errori.descrizioneAggiuntiva.invalid = true;
    errori.descrizioneAggiuntiva.messaggio = 'La descrizione aggiuntiva deve essere di massimo 200 caratteri';
  } else {
    errori.descrizioneAggiuntiva.invalid = false;
    errori.descrizioneAggiuntiva.messaggio = '';
  }
};

const validaEAvanza = () => {
  validaCampi();
  if (!errori.descrizioneAggiuntiva.invalid) {
    emit('avanti');
  }
};

const hasErrori = computed(() => {
  return Object.values(errori).some(e => e.invalid);
});

// Esponiamo la funzione validaCampi al componente genitore
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
        <li v-if="errori.descrizioneAggiuntiva.invalid">Descrizione Aggiuntiva</li>
      </ul>
    </Message>

    <div class="flex flex-col">
      <label class="font-semibold">Caratteristiche Aggiuntive</label>
      <div class="flex flex-wrap">
        <div class="flex align-items-center mr-4">
          <ToggleSwitch v-model="annuncio.immobile.caratteristicheAggiuntive.balconi" />
          <span class="ml-2">Balconi</span>
        </div>
        <div class="flex align-items-center mr-4">
          <ToggleSwitch v-model="annuncio.immobile.caratteristicheAggiuntive.garage" />
          <span class="ml-2">Garage</span>
        </div>
        <div class="flex align-items-center mr-4">
          <ToggleSwitch v-model="annuncio.immobile.caratteristicheAggiuntive.postiAuto" />
          <span class="ml-2">Posti Auto</span>
        </div>
        <div class="flex align-items-center mr-4">
          <ToggleSwitch v-model="annuncio.immobile.caratteristicheAggiuntive.giardino" />
          <span class="ml-2">Giardino</span>
        </div>
        <div class="flex align-items-center mr-4">
          <ToggleSwitch v-model="annuncio.immobile.caratteristicheAggiuntive.ascensore" />
          <span class="ml-2">Ascensore</span>
        </div>
        <div class="flex align-items-center mr-4">
          <ToggleSwitch v-model="annuncio.immobile.caratteristicheAggiuntive.portiere" />
          <span class="ml-2">Portiere</span>
        </div>
        <div class="flex align-items-center mr-4">
          <ToggleSwitch v-model="annuncio.immobile.caratteristicheAggiuntive.riscaldamentoCentralizzato" />
          <span class="ml-2">Riscaldamento Centralizzato</span>
        </div>
        <div class="flex align-items-center mr-4">
          <ToggleSwitch v-model="annuncio.immobile.caratteristicheAggiuntive.climatizzatori" />
          <span class="ml-2">Climatizzatori</span>
        </div>
        <div class="flex align-items-center mr-4">
          <ToggleSwitch v-model="annuncio.immobile.caratteristicheAggiuntive.pannelliSolari" />
          <span class="ml-2">Pannelli Solari</span>
        </div>
        <div class="flex align-items-center mr-4">
          <ToggleSwitch v-model="annuncio.immobile.caratteristicheAggiuntive.cantina" />
          <span class="ml-2">Cantina</span>
        </div>
        <div class="flex align-items-center mr-4">
          <ToggleSwitch v-model="annuncio.immobile.caratteristicheAggiuntive.soffitta" />
          <span class="ml-2">Soffitta</span>
        </div>
      </div>

      <label for="descrizioneAggiuntiva" class="font-semibold mt-4">Descrizione Aggiuntiva</label>
      <Textarea 
        id="descrizioneAggiuntiva" 
        v-model="annuncio.immobile.caratteristicheAggiuntive.descrizioneAggiuntiva" 
        rows="4" 
        :invalid="errori.descrizioneAggiuntiva.invalid" 
        @input="validaCampi" 
        class="border rounded p-2"
      />
      <Message v-if="errori.descrizioneAggiuntiva.invalid" severity="error" variant="simple" size="small">{{ errori.descrizioneAggiuntiva.messaggio }}</Message>
    </div>

    <div class="flex justify-end pt-6">
      <Button label="Avanti" icon="pi pi-arrow-right" iconPos="right" @click="validaEAvanza" />
    </div>
  </div>
</template>