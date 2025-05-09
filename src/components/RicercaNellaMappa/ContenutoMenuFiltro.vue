<template>
  <div
    class="flex flex-col gap-8 w-full h-full overflow-y-auto items-start justify-start p-2 bg-white"
  >
    <div class="tipologia-immobile flex flex-col items-start justify-start">
      <label class="block text-lg font-semibold mb-1">Tipologia immobile</label>
      <Select
        v-model="selectedTipologiaImmobile"
        :options="opzioniTipologiaImmobile"
        optionLabel="name"
        placeholder="Select a City"
        class="w-full md:w-56"
        @change="setFiltroTipologiaImmobile"
      />
    </div>

    <div class="contratto-immobile flex flex-col items-start justify-start">
      <label class="block text-lg font-semibold mb-1"
        >Tipologia contratto</label
      >
      <div class="card flex justify-center">
        <SelectButton
          v-model="props.filtro.tipologiaContratto"
          :options="opzioniContratto"
        />
      </div>
    </div>

    <div class="prezzo-immobile flex flex-row gap-2">
      <div class="flex flex-col items-start justify-start">
        <label class="block text-lg font-semibold mb-1">Prezzo minimo</label>
        <InputNumber
          v-model="props.filtro.prezzoMin"
          inputId="locale-german"
          locale="de-DE"
          :min="0"
          fluid
        />
      </div>
      <div class="flex flex-col items-start justify-start">
        <label class="block text-lg font-semibold mb-1">Prezzo massimo</label>
        <InputNumber
          v-model="props.filtro.prezzoMax"
          inputId="locale-german"
          locale="de-DE"
          :min="0"
          fluid
        />
      </div>
    </div>

    <div class="dimensione-immobile flex flex-row gap-2">
      <div class="flex flex-col items-start justify-start">
        <label class="block text-lg font-semibold mb-1"
          >Metri quadri minimo</label
        >
        <InputNumber v-model="props.filtro.metriQuadriMin" :min="0" fluid />
      </div>
      <div class="flex flex-col items-start justify-start">
        <label class="block text-lg font-semibold mb-1"
          >Metri quadri massimo</label
        >
        <InputNumber v-model="props.filtro.metriQuadriMax" :min="0" fluid />
      </div>
    </div>

    <div
      class="altre-caratteristiche flex flex-col items-start justify-start gap-2"
    >
      <label class="block text-lg font-semibold mb-1"
        >Caratteristiche Aggiuntive</label
      >

      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="props.filtro.balconi" />
        <span class="">Balconi</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="props.filtro.garage" />
        <span class="">Garage</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="props.filtro.postiAuto" />
        <span class="">Posti auto</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="props.filtro.giardino" />
        <span class="">Giardino</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="props.filtro.ascensore" />
        <span class="">Ascensore</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="props.filtro.portiere" />
        <span class="">Portiere</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="props.filtro.riscaldamentoCentralizzato" />
        <span class="">Riscaldamento Centralizzato</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="props.filtro.climatizzatori" />
        <span class="">Climatizzatori</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="props.filtro.pannelliSolari" />
        <span class="">Pannelli Solari</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="props.filtro.cantina" />
        <span class="">Cantina</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="props.filtro.soffitta" />
        <span class="">Soffitta</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import ToggleSwitch from "primevue/toggleswitch";
import SelectButton from "primevue/selectbutton";

import { ref, watch, defineProps } from "vue";

const props = defineProps(["filtro"]);

const opzioniContratto = ref(["AFFITTO", "VENDITA"]);

const opzioniTipologiaImmobile = ref([
  { name: "APPARTAMENTO" },
  { name: "TERRENO" },
  { name: "UFFICIO" },
  { name: "POSTOAUTO" },
  { name: "ALTRO" },
]);

const selectedTipologiaImmobile = ref({ name: props.filtro.tipologiaImmobile });
const setFiltroTipologiaImmobile = () => {
  props.filtro.tipologiaImmobile = selectedTipologiaImmobile.value.name;
};
watch(
  props.filtro,
  (newVal) => {
    selectedTipologiaImmobile.value = { name: newVal.tipologiaImmobile };
  },
  { deep: true },
);
</script>
