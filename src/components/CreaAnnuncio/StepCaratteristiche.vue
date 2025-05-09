<script setup>
import {
  defineProps,
  defineEmits,
  defineExpose,
  reactive,
  computed,
} from "vue";
import ToggleSwitch from "primevue/toggleswitch";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Message from "primevue/message";
import { AnnuncioImmobiliareRequest } from "../../dto/RequestAnnuncio";
import { scrollToFirstError } from "../../utils/scrollToError";
import StickyButtons from "./StickyButtons.vue";
const emit = defineEmits(["indietro", "avanti"]);

const props = defineProps({
  annuncio: {
    type: AnnuncioImmobiliareRequest,
    required: true,
  },
  tentativoInvio: Boolean,
});

const errori = reactive({
  descrizioneAggiuntiva: { invalid: false, messaggio: "" },
});

// Funzione di validazione
const validaCampi = () => {
  const descrizioneAggiuntiva =
    props.annuncio.immobile.caratteristicheAggiuntive.descrizioneAggiuntiva?.trim() ||
    "";
  if (descrizioneAggiuntiva.length > 200) {
    errori.descrizioneAggiuntiva.invalid = true;
    errori.descrizioneAggiuntiva.messaggio =
      "La descrizione aggiuntiva deve essere di massimo 200 caratteri";
  } else {
    errori.descrizioneAggiuntiva.invalid = false;
    errori.descrizioneAggiuntiva.messaggio = "";
  }
  return !Object.values(errori).some((e) => e.invalid);
};

const validaEAvanza = () => {
  validaCampi();
  if (!errori.descrizioneAggiuntiva.invalid) {
    emit("avanti");
  } else {
    scrollToFirstError(errori);
  }
};

const hasErrori = computed(() => {
  return Object.values(errori).some((e) => e.invalid);
});

// Esponiamo la funzione validaCampi al componente genitore
defineExpose({
  validaCampi,
  hasErrori,
});
</script>

<template>
  <div class="">
    <Message
      v-if="hasErrori && tentativoInvio"
      severity="error"
      variant="filled"
      class="mb-4 text-left"
    >
      <p>
        Alcuni campi non sono corretti. Verifica e correggi i seguenti campi
        evidenziati in rosso:
      </p>
      <ul class="list-disc pl-5">
        <li v-if="errori.descrizioneAggiuntiva.invalid">
          Descrizione Aggiuntiva
        </li>
      </ul>
    </Message>

    <div class="flex flex-col">
      <label class="font-semibold">Caratteristiche Aggiuntive</label>
      <div class="flex flex-col gap-2">
        <div class="flex flex-col sm:flex-row items-center">
          <span class="block sm:hidden mb-1">Balconi</span>
          <ToggleSwitch
            v-model="annuncio.immobile.caratteristicheAggiuntive.balconi"
          />
          <span class="ml-2 hidden sm:block">Balconi</span>
        </div>
        <div class="flex flex-col sm:flex-row items-center">
          <span class="block sm:hidden mb-1">Garage</span>
          <ToggleSwitch
            v-model="annuncio.immobile.caratteristicheAggiuntive.garage"
          />
          <span class="ml-2 hidden sm:block">Garage</span>
        </div>
        <div class="flex flex-col sm:flex-row items-center">
          <span class="block sm:hidden mb-1">Posti Auto</span>
          <ToggleSwitch
            v-model="annuncio.immobile.caratteristicheAggiuntive.postiAuto"
          />
          <span class="ml-2 hidden sm:block">Posti Auto</span>
        </div>
        <div class="flex flex-col sm:flex-row items-center">
          <span class="block sm:hidden mb-1">Giardino</span>
          <ToggleSwitch
            v-model="annuncio.immobile.caratteristicheAggiuntive.giardino"
          />
          <span class="ml-2 hidden sm:block">Giardino</span>
        </div>
        <div class="flex flex-col sm:flex-row items-center">
          <span class="block sm:hidden mb-1">Pannelli Solari</span>
          <ToggleSwitch
            v-model="annuncio.immobile.caratteristicheAggiuntive.pannelliSolari"
          />
          <span class="ml-2 hidden sm:block">Pannelli Solari</span>
        </div>
        <div class="flex flex-col sm:flex-row items-center">
          <span class="block sm:hidden mb-1">Cantina</span>
          <ToggleSwitch
            v-model="annuncio.immobile.caratteristicheAggiuntive.cantina"
          />
          <span class="ml-2 hidden sm:block">Cantina</span>
        </div>
        <div class="flex flex-col sm:flex-row items-center">
          <span class="block sm:hidden mb-1">Ascensore</span>
          <ToggleSwitch
            v-model="annuncio.immobile.caratteristicheAggiuntive.ascensore"
          />
          <span class="ml-2 hidden sm:block">Ascensore</span>
        </div>
        <div class="flex flex-col sm:flex-row items-center">
          <span class="block sm:hidden mb-1">Portiere</span>
          <ToggleSwitch
            v-model="annuncio.immobile.caratteristicheAggiuntive.portiere"
          />
          <span class="ml-2 hidden sm:block">Portiere</span>
        </div>
        <div class="flex flex-col sm:flex-row items-center">
          <span class="block sm:hidden mb-1">Riscaldamento Centralizzato</span>
          <ToggleSwitch
            v-model="
              annuncio.immobile.caratteristicheAggiuntive
                .riscaldamentoCentralizzato
            "
          />
          <span class="ml-2 hidden sm:block">Riscaldamento Centralizzato</span>
        </div>
        <div class="flex flex-col sm:flex-row items-center">
          <span class="block sm:hidden mb-1">Climatizzatori</span>
          <ToggleSwitch
            v-model="annuncio.immobile.caratteristicheAggiuntive.climatizzatori"
          />
          <span class="ml-2 hidden sm:block">Climatizzatori</span>
        </div>
        <div class="flex flex-col sm:flex-row items-center">
          <span class="block sm:hidden mb-1">Soffitta</span>
          <ToggleSwitch
            v-model="annuncio.immobile.caratteristicheAggiuntive.soffitta"
          />
          <span class="ml-2 hidden sm:block">Soffitta</span>
        </div>
      </div>

      <label for="descrizioneAggiuntiva" class="font-semibold mt-4"
        >Altre caratteristiche</label
      >
      <Textarea
        id="descrizioneAggiuntiva"
        v-model="
          annuncio.immobile.caratteristicheAggiuntive.descrizioneAggiuntiva
        "
        rows="4"
        :invalid="errori.descrizioneAggiuntiva.invalid"
        @input="validaCampi"
        class="border rounded p-2"
      />
      <Message
        v-if="errori.descrizioneAggiuntiva.invalid"
        severity="error"
        variant="simple"
        size="small"
        >{{ errori.descrizioneAggiuntiva.messaggio }}</Message
      >
    </div>
    <StickyButtons>
      <div class="flex pt-6 justify-between">
        <Button
          label="Indietro"
          severity="secondary"
          icon="pi pi-arrow-left"
          @click="$emit('indietro')"
        />
        <Button
          label="Avanti"
          icon="pi pi-arrow-right"
          iconPos="right"
          @click="validaEAvanza"
        />
      </div>
    </StickyButtons>
  </div>
</template>
