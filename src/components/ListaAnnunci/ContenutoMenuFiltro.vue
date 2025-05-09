<template>
  <div
    class="flex flex-col gap-8 w-full md:h-100 overflow-y-auto items-start justify-start p-2 bg-white"
  >
    <div class="luogo w-full">
      <div
        class="Comune-nella-mappa flex flex-col items-start justify-start mb-2"
      >
        <label class="block text-lg font-semibold mb-1">Comune</label>
        <AutoComplete
          :fluid="true"
          v-model="luogoCercato"
          optionLabel="comune"
          :suggestions="filteredCountries"
          placeholder="Scrivi dove cerchi l'immobile"
          @complete="search"
        />
      </div>

      <div class="w-[90%] h-60">
        <Mappa :luogo="luogoCercato" />
      </div>
    </div>

    <div class="tipologia-immobile flex flex-col items-start justify-start">
      <label class="block text-lg font-semibold mb-1">Tipologia immobile</label>
      <Select
        v-model="selectedTipologiaImmobile"
        :options="opzioniTipologiaImmobile"
        optionLabel="name"
        placeholder="Select a City"
        class="w-full md:w-56"
        @change="buckupSelectedImmobile"
      />
    </div>

    <div class="contratto-immobile flex flex-col items-start justify-start">
      <label class="block text-lg font-semibold mb-1"
        >Tipologia contratto</label
      >
      <div class="card flex justify-center">
        <SelectButton v-model="selectedContratto" :options="opzioniContratto" />
      </div>
    </div>

    <div class="prezzo-immobile flex flex-row gap-2">
      <div class="flex flex-col items-start justify-start">
        <label class="block text-lg font-semibold mb-1">Prezzo minimo</label>
        <InputNumber
          v-model="valorePrezzoMinimo"
          inputId="locale-german"
          locale="de-DE"
          :min="0"
          fluid
        />
      </div>
      <div class="flex flex-col items-start justify-start">
        <label class="block text-lg font-semibold mb-1">Prezzo massimo</label>
        <InputNumber
          v-model="valorePrezzoMassimo"
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
        <InputNumber v-model="valoreMetriQuadriMinimo" :min="0" fluid />
      </div>
      <div class="flex flex-col items-start justify-start">
        <label class="block text-lg font-semibold mb-1"
          >Metri quadri massimo</label
        >
        <InputNumber v-model="valoreMetriQuadriMassimo" :min="0" fluid />
      </div>
    </div>

    <div
      class="altre-caratteristiche flex flex-col items-start justify-start gap-2"
    >
      <label class="block text-lg font-semibold mb-1"
        >Caratteristiche Aggiuntive</label
      >

      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="caratteristicheAggiuntive.balconi" />
        <span class="">Balconi</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="caratteristicheAggiuntive.garage" />
        <span class="">Garage</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="caratteristicheAggiuntive.postiAuto" />
        <span class="">Posti auto</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="caratteristicheAggiuntive.giardino" />
        <span class="">Giardino</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="caratteristicheAggiuntive.ascensore" />
        <span class="">Ascensore</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="caratteristicheAggiuntive.portiere" />
        <span class="">Portiere</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch
          v-model="caratteristicheAggiuntive.riscaldamentoCentralizzato"
        />
        <span class="">Riscaldamento Centralizzato</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="caratteristicheAggiuntive.climatizzatori" />
        <span class="">Climatizzatori</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="caratteristicheAggiuntive.pannelliSolari" />
        <span class="">Pannelli Solari</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="caratteristicheAggiuntive.cantina" />
        <span class="">Cantina</span>
      </div>
      <div class="flex flex-row items-start justify-start">
        <ToggleSwitch v-model="caratteristicheAggiuntive.soffitta" />
        <span class="">Soffitta</span>
      </div>
    </div>
  </div>
  <!-- Bottone sempre visibile -->
  <Button class="!fixed !bottom-4 !left-4" @click="onApliccaFiltro" on>
    Applica filtro
  </Button>
</template>

<script setup>
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import ToggleSwitch from "primevue/toggleswitch";
import Button from "primevue/button";
import SelectButton from "primevue/selectbutton";
import AutoComplete from "primevue/autocomplete";

import Mappa from "../ListaAnnunci/Mappa.vue";

import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import { CountryService } from "../../services/ComuniItalianiService";

const router = useRouter();
const route = useRoute();

const countries = ref();
const filteredCountries = ref();
const luogoCercato = ref({
  comune: route.query.comune,
  latitudine: route.query.lat,
  longitudine: route.query.lon,
});

const selectedTipologiaImmobile = ref();
selectedTipologiaImmobile.value = route.query.immobile
  ? ref({ name: route.query.immobile })
  : null;
const opzioniTipologiaImmobile = ref([
  { name: "APPARTAMENTO" },
  { name: "TERRENO" },
  { name: "UFFICIO" },
  { name: "POSTOAUTO" },
  { name: "ALTRO" },
]);
const selectedTipologiaImmobileBackup = ref(route.query.immobile);
const buckupSelectedImmobile = () => {
  selectedTipologiaImmobileBackup.value = selectedTipologiaImmobile.value.name;
};

const selectedContratto = ref(route.query.contratto);
const opzioniContratto = ref(["AFFITTO", "VENDITA"]);

const valorePrezzoMinimo = ref(route.query.prezzoMin);
const valorePrezzoMassimo = ref(route.query.prezzoMax);
const valoreMetriQuadriMinimo = ref(route.query.mqMin);
const valoreMetriQuadriMassimo = ref(route.query.mqMax);
const valoreDistanzaMassima = ref(5);

const caratteristicheAggiuntive = ref({
  balconi:
    route.query.balconi == true || route.query.balconi == "true" ? true : false,
  garage:
    route.query.garage == true || route.query.garage == "true" ? true : false,
  postiAuto:
    route.query.postiAuto == true || route.query.postiAuto == "true"
      ? true
      : false,
  giardino:
    route.query.giardino == true || route.query.giardino == "true"
      ? true
      : false,
  ascensore:
    route.query.ascensore == true || route.query.ascensore == "true"
      ? true
      : false,
  portiere:
    route.query.portiere == true || route.query.portiere == "true"
      ? true
      : false,
  riscaldamentoCentralizzato:
    route.query.riscaldamentoCentralizzato == true ||
    route.query.riscaldamentoCentralizzato == "true"
      ? true
      : false,
  climatizzatori:
    route.query.climatizzatore == true || route.query.climatizzatore == "true"
      ? true
      : false,
  pannelliSolari:
    route.query.pannelliSolari == true || route.query.pannelliSolari == "true"
      ? true
      : false,
  cantina:
    route.query.cantina == true || route.query.cantina == "true" ? true : false,
  soffitta:
    route.query.soffitta == true || route.query.soffitta == "true"
      ? true
      : false,
});

onMounted(() => {
  CountryService.getCountries().then((data) => (countries.value = data));
});

const search = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredCountries.value = [...countries.value];
    } else {
      filteredCountries.value = countries.value.filter((country) => {
        return country.comune
          .toLowerCase()
          .startsWith(event.query.toLowerCase());
      });
    }
  }, 250);
};

const onApliccaFiltro = () => {
  router.push({
    path: "/annunci",
    query: {
      ...route.query,
      comune: luogoCercato.value.comune,
      immobile: selectedTipologiaImmobileBackup.value,
      contratto: selectedContratto.value,
      page: 1,
      raggio: valoreDistanzaMassima.value,
      lat: route.query.lat,
      lon: route.query.lon,
      prezzoMin: valorePrezzoMinimo.value,
      prezzoMax: valorePrezzoMassimo.value,
      mqMin: valoreMetriQuadriMinimo.value,
      mqMax: valoreMetriQuadriMassimo.value,
      balconi: caratteristicheAggiuntive.value.balconi
        ? caratteristicheAggiuntive.value.balconi
        : null,
      garage: caratteristicheAggiuntive.value.garage
        ? caratteristicheAggiuntive.value.garage
        : null,
      postiAuto: caratteristicheAggiuntive.value.postiAuto
        ? caratteristicheAggiuntive.value.postiAuto
        : null,
      giardino: caratteristicheAggiuntive.value.giardino
        ? caratteristicheAggiuntive.value.giardino
        : null,
      ascensore: caratteristicheAggiuntive.value.ascensore
        ? caratteristicheAggiuntive.value.ascensore
        : null,
      portiere: caratteristicheAggiuntive.value.portiere
        ? caratteristicheAggiuntive.value.portiere
        : null,
      riscaldamentoCentralizzato: caratteristicheAggiuntive.value
        .riscaldamentoCentralizzato
        ? caratteristicheAggiuntive.value.riscaldamentoCentralizzato
        : null,
      climatizzatore: caratteristicheAggiuntive.value.climatizzatori
        ? caratteristicheAggiuntive.value.climatizzatori
        : null,
      pannelliSolari: caratteristicheAggiuntive.value.pannelliSolari
        ? caratteristicheAggiuntive.value.pannelliSolari
        : null,
      cantina: caratteristicheAggiuntive.value.cantina
        ? caratteristicheAggiuntive.value.cantina
        : null,
      soffitta: caratteristicheAggiuntive.value.soffitta
        ? caratteristicheAggiuntive.value.soffitta
        : null,
    },
  });
};

watch(route, (newRoute) => {
  valorePrezzoMinimo.value = route.query.prezzoMin
    ? parseInt(route.query.prezzoMin)
    : null;
  valorePrezzoMassimo.value = route.query.prezzoMax
    ? parseInt(route.query.prezzoMax)
    : null;
  valoreMetriQuadriMinimo.value = route.query.mqMin
    ? parseInt(route.query.mqMin)
    : null;
  valoreMetriQuadriMassimo.value = route.query.mqMax
    ? parseInt(route.query.mqMax)
    : null;
  selectedTipologiaImmobile.value = route.query.immobile
    ? ref({ name: route.query.immobile })
    : null;
  selectedContratto.value = route.query.contratto
    ? route.query.contratto
    : null;

  caratteristicheAggiuntive.value.balconi = route.query.balconi ? true : false;
  caratteristicheAggiuntive.value.garage = route.query.garage ? true : false;
  caratteristicheAggiuntive.value.postiAuto = route.query.postiAuto
    ? true
    : false;
  caratteristicheAggiuntive.value.giardino = route.query.giardino
    ? true
    : false;
  caratteristicheAggiuntive.value.ascensore = route.query.ascensore
    ? true
    : false;
  caratteristicheAggiuntive.value.portiere = route.query.portiere
    ? true
    : false;
  caratteristicheAggiuntive.value.riscaldamentoCentralizzato = route.query
    .riscaldamentoCentralizzato
    ? true
    : false;
  caratteristicheAggiuntive.value.climatizzatori = route.query.climatizzatore
    ? true
    : false;
  caratteristicheAggiuntive.value.pannelliSolari = route.query.pannelliSolari
    ? true
    : false;
  caratteristicheAggiuntive.value.cantina = route.query.cantina ? true : false;
  caratteristicheAggiuntive.value.soffitta = route.query.soffitta
    ? true
    : false;
});
</script>
