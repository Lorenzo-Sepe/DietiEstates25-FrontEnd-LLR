<template>
  <div class="flex flex-col gap-8 w-full h-[65%] items-start justify-start p-2 overflow-y-auto bg-gray-100">
    <div class="luogo w-full">
      <div class="Comune-nella-mappa flex flex-col items-start justify-start mb-2">
        <label for="autocomplete-comune" class="block text-lg font-semibold mb-1">Comune</label>
        <AutoComplete id="autocomplete-comune" :fluid="true" v-model="luogoCercato" optionLabel="comune"
          :suggestions="filteredCountries" placeholder="Scrivi dove cerchi l'immobile" @complete="search" />
      </div>

      <div class="w-[90%] h-60">
        <Mappa :luogo="luogoCercato" />
      </div>
    </div>

    <div class="tipologia-immobile flex flex-col items-start justify-start">
      <label for="select-tipologia-immobile" class="block text-lg font-semibold mb-1">Tipologia immobile</label>
      <Select id="select-tipologia-immobile" v-model="selectedTipologiaImmobile" :options="opzioniTipologiaImmobile"
        optionLabel="name" placeholder="Select a City" class="w-full md:w-56" @change="buckupSelectedImmobile" />
    </div>

    <div class="contratto-immobile flex flex-col items-start justify-start">
      <label for="selectbutton-contratto" class="block text-lg font-semibold mb-1">Tipologia contratto</label>
      <div class="card flex justify-center">
        <SelectButton id="selectbutton-contratto" v-model="selectedContratto" :options="opzioniContratto" />
      </div>
    </div>

    <div class="prezzo-immobile flex flex-row gap-2">
      <div class="flex flex-col items-start justify-start">
        <label class="block text-lg font-semibold mb-1">Prezzo minimo</label>
        <InputNumber v-model="valorePrezzoMinimo" inputId="locale-german" locale="de-DE" :min="0" fluid />
      </div>
      <div class="flex flex-col items-start justify-start">
        <label class="block text-lg font-semibold mb-1">Prezzo massimo</label>
        <InputNumber v-model="valorePrezzoMassimo" inputId="locale-german" locale="de-DE" :min="0" fluid />
      </div>
    </div>

    <div class="dimensione-immobile flex flex-row gap-2">
      <div class="flex flex-col items-start justify-start">
        <label class="block text-lg font-semibold mb-1">Metri quadri minimo</label>
        <InputNumber v-model="valoreMetriQuadriMinimo" :min="0" fluid />
      </div>
      <div class="flex flex-col items-start justify-start">
        <label class="block text-lg font-semibold mb-1">Metri quadri massimo</label>
        <InputNumber v-model="valoreMetriQuadriMassimo" :min="0" fluid />
      </div>
    </div>

    <div class="altre-caratteristiche flex flex-col items-start justify-start gap-2">
      <label class="block text-lg font-semibold mb-1">Caratteristiche Aggiuntive</label>

      <div class="card flex justify-center">
        <MultiSelect v-model="caratteristicheSelezionate" :options="caratteristiche" optionLabel="name" filter
          placeholder="Caratteristiche aggiuntive" :maxSelectedLabels="3" class="w-full md:w-80" />
      </div>
    </div>
  </div>

  <!-- Bottone sempre visibile -->
  <div class="mt-4 bg-gray-100 p-4 w-full flex justify-center border-t border-gray-300">
    <Button class="w-full" @click="onApliccaFiltro">
      Applica filtro
    </Button>
  </div>

</template>

<script setup>
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import ToggleSwitch from "primevue/toggleswitch";
import Button from "primevue/button";
import SelectButton from "primevue/selectbutton";
import AutoComplete from "primevue/autocomplete";
import MultiSelect from "primevue/multiselect";

import Mappa from "../ListaAnnunci/Mappa.vue";

import { ref, onMounted, watch, defineEmits } from "vue";
import { useRouter, useRoute } from "vue-router";

import { CountryService } from "../../services/ComuniItalianiService";

const router = useRouter();
const route = useRoute();

const emit = defineEmits(["chiudiDrawer"]);

const countries = ref();
const filteredCountries = ref();
const luogoCercato = ref(route.query.comune);

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

const caratteristicheSelezionate = ref();
const caratteristiche = ref([
  { name: "Balconi" },
  { name: "Garage" },
  { name: "Posti auto" },
  { name: "Giardino" },
  { name: "Ascensore" },
  { name: "Portiere" },
  { name: "Riscaldamento centralizzato" },
  { name: "Climatizzatori" },
  { name: "Pannelli solari" },
  { name: "Cantina" },
  { name: "Soffitta" },
]);

onMounted(() => {
  CountryService.getCountries().then((data) => (countries.value = data));
  inizializzaCaratteristicheSelezionate();
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
  console.log("multiselecttttt:::", caratteristicheSelezionate.value);

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

      balconi: isCaratteristicaSelezionata("Balconi") ? true : null,
      garage: isCaratteristicaSelezionata("Garage") ? true : null,
      postiAuto: isCaratteristicaSelezionata("Posti auto") ? true : null,
      giardino: isCaratteristicaSelezionata("Giardino") ? true : null,
      ascensore: isCaratteristicaSelezionata("Ascensore") ? true : null,
      portiere: isCaratteristicaSelezionata("Portiere") ? true : null,
      riscaldamentoCentralizzato: isCaratteristicaSelezionata(
        "Riscaldamento centralizzato",
      )
        ? true
        : null,
      climatizzatore: isCaratteristicaSelezionata("Climatizzatori")
        ? true
        : null,
      pannelliSolari: isCaratteristicaSelezionata("Pannelli solari")
        ? true
        : null,
      cantina: isCaratteristicaSelezionata("Cantina") ? true : null,
      soffitta: isCaratteristicaSelezionata("Soffitta") ? true : null,
    },
  });

  emit("chiudiDrawer");
};

const isCaratteristicaSelezionata = (caratteristica) => {
  for (const elemento of caratteristicheSelezionate.value) {
    if (elemento.name === caratteristica) {
      return true;
    }
  }

  return false;
};

const inizializzaCaratteristicheSelezionate = () => {
  caratteristicheSelezionate.value = [];

  if (route.query.balconi == true || route.query.balconi == "true")
    caratteristicheSelezionate.value.push({ name: "Balconi" });
  if (route.query.garage == true || route.query.garage == "true")
    caratteristicheSelezionate.value.push({ name: "Garage" });
  if (route.query.postiAuto == true || route.query.postiAuto == "true")
    caratteristicheSelezionate.value.push({ name: "Posti auto" });
  if (route.query.giardino == true || route.query.giardino == "true")
    caratteristicheSelezionate.value.push({ name: "Giardino" });
  if (route.query.ascensore == true || route.query.ascensore == "true")
    caratteristicheSelezionate.value.push({ name: "Ascensore" });
  if (route.query.portiere == true || route.query.portiere == "true")
    caratteristicheSelezionate.value.push({ name: "Portiere" });
  if (
    route.query.riscaldamentoCentralizzato == true ||
    route.query.riscaldamentoCentralizzato == "true"
  )
    caratteristicheSelezionate.value.push({
      name: "Riscaldamento centralizzato",
    });
  if (
    route.query.climatizzatore == true ||
    route.query.climatizzatore == "true"
  )
    caratteristicheSelezionate.value.push({ name: "Climatizzatori" });
  if (
    route.query.pannelliSolari == true ||
    route.query.pannelliSolari == "true"
  )
    caratteristicheSelezionate.value.push({ name: "Pannelli solari" });
  if (route.query.cantina == true || route.query.cantina == "true")
    caratteristicheSelezionate.value.push({ name: "Cantina" });
  if (route.query.soffitta == true || route.query.soffitta == "true")
    caratteristicheSelezionate.value.push({ name: "Soffitta" });
};

watch(route, (newRoute) => {
  caratteristicheSelezionate.value = [];

  luogoCercato.value = newRoute.query.comune

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

  if (route.query.balconi == true || route.query.balconi == "true")
    caratteristicheSelezionate.value.push({ name: "Balconi" });
  if (route.query.garage == true || route.query.garage == "true")
    caratteristicheSelezionate.value.push({ name: "Garage" });
  if (route.query.postiAuto == true || route.query.postiAuto == "true")
    caratteristicheSelezionate.value.push({ name: "Posti auto" });
  if (route.query.giardino == true || route.query.giardino == "true")
    caratteristicheSelezionate.value.push({ name: "Giardino" });
  if (route.query.ascensore == true || route.query.ascensore == "true")
    caratteristicheSelezionate.value.push({ name: "Ascensore" });
  if (route.query.portiere == true || route.query.portiere == "true")
    caratteristicheSelezionate.value.push({ name: "Portiere" });
  if (
    route.query.riscaldamentoCentralizzato == true ||
    route.query.riscaldamentoCentralizzato == "true"
  )
    caratteristicheSelezionate.value.push({
      name: "Riscaldamento centralizzato",
    });
  if (
    route.query.climatizzatore == true ||
    route.query.climatizzatore == "true"
  )
    caratteristicheSelezionate.value.push({ name: "Climatizzatori" });
  if (
    route.query.pannelliSolari == true ||
    route.query.pannelliSolari == "true"
  )
    caratteristicheSelezionate.value.push({ name: "Pannelli solari" });
  if (route.query.cantina == true || route.query.cantina == "true")
    caratteristicheSelezionate.value.push({ name: "Cantina" });
  if (route.query.soffitta == true || route.query.soffitta == "true")
    caratteristicheSelezionate.value.push({ name: "Soffitta" });
});
</script>
