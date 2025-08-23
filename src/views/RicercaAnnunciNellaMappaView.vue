<template>
  <div class="w-full h-full">
    <div class="w-full h-full flex flex-row gap-2 my-4">
      <div class="filtro-laterale w-120 h-120 hidden lg:block mx-2">
        <ContenutoMenuFiltro v-if="valoriCaricati" :filtro="filtroAnnunci" />
      </div>

      <div class="area-centrale flex flex-col w-full gap-2">
        <div class="area-superiore w-full flex items-start lg:hidden">
          <Drawer v-model:visible="drawerVisible" header="Filtro">
            <ContenutoMenuFiltro />
          </Drawer>
          <Button label="Filtro" @click="drawerVisible = true" />
        </div>

        <div class="mappa w-full lg:h-120 h-100">
          <Mappa :annunci="annunciResponse" :loading="loadingAnnunci" :filtro="filtroAnnunci" />
        </div>
      </div>
    </div>

    <div class="area-inferiore w-full flex items-center px-8">
      <Button @click="setQueryRoute" class="w-full" label="Vedi risultati" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import AnnunciImmobiliService from "../services/AnnunciImmobiliService.js";
import { FiltroAnnuncioRequest } from "../dto/FiltroAnnunciRequest.js";
import { AnnuncioImmobiliareResponse } from "../dto/Response/AnnuncioImmobiliareResponse.js";

import Button from "primevue/button";
import Drawer from "primevue/drawer";

import ContenutoMenuFiltro from "../components/RicercaNellaMappa/ContenutoMenuFiltro.vue";
import Mappa from "../components/RicercaNellaMappa/Mappa.vue";

const filtroAnnunci = reactive(new FiltroAnnuncioRequest());
const annunciResponse = ref([]);
const loadingAnnunci = ref(false);
const drawerVisible = ref(false);
const valoriCaricati = ref(false);

const router = useRouter();
const route = useRoute();

onMounted(() => {
  setFiltro();

  valoriCaricati.value = true;
});

const setFiltro = () => {
  //Caratteristiche principali
  filtroAnnunci.tipologiaImmobile = route.query.immobile
    ? route.query.immobile
    : null;
  filtroAnnunci.tipologiaContratto = route.query.contratto
    ? route.query.contratto
    : null;
  filtroAnnunci.prezzoMin = route.query.prezzoMin
    ? parseInt(route.query.prezzoMin)
    : null;
  filtroAnnunci.prezzoMax = route.query.prezzoMax
    ? parseInt(route.query.prezzoMax)
    : null;
  filtroAnnunci.metriQuadriMin = route.query.mqMin
    ? parseInt(route.query.mqMin)
    : null;
  filtroAnnunci.metriQuadriMax = route.query.mqMax
    ? parseInt(route.query.mqMax)
    : null;

  //Caratteristiche aggiuntive
  filtroAnnunci.balconi = route.query.balconi === "true" ? true : null;
  filtroAnnunci.garage = route.query.garage === "true" ? true : null;
  filtroAnnunci.postiAuto = route.query.postiAuto === "true" ? true : null;
  filtroAnnunci.giardino = route.query.giardino === "true" ? true : null;
  filtroAnnunci.ascensore = route.query.ascensore === "true" ? true : null;
  filtroAnnunci.portiere = route.query.portiere === "true" ? true : null;
  filtroAnnunci.riscaldamentoCentralizzato =
    route.query.riscaldamento === "true" ? true : null;
  filtroAnnunci.climatizzatori =
    route.query.climatizzatore === "true" ? true : null;
  filtroAnnunci.pannelliSolari =
    route.query.pannelliSolari === "true" ? true : null;
  filtroAnnunci.cantina = route.query.cantina === "true" ? true : null;
  filtroAnnunci.soffitta = route.query.soffitta === "true" ? true : null;

  //Localizzazione
  filtroAnnunci.latCentro = route.query.lat
    ? parseFloat(route.query.lat)
    : null;
  filtroAnnunci.lonCentro = route.query.lon
    ? parseFloat(route.query.lon)
    : null;
  filtroAnnunci.raggioKm = route.query.raggio
    ? parseFloat(route.query.raggio)
    : null;

  //Tutti gli annunci
  filtroAnnunci.numeroPagina = null;
  filtroAnnunci.numeroDiElementiPerPagina = null;
};

const mostraAnnunciSullaMappa = async () => {
  try {
    console.log("Filtro annunci: ", filtroAnnunci);
    loadingAnnunci.value = true;
    const annunci = await AnnunciImmobiliService.getAnnunci(filtroAnnunci);
    setAnnunciResponse(annunci);
    console.log("resposne: ", annunci);
    console.log("annunciResponse: ", annunciResponse);
  } catch (error) {
    console.error(
      "Errore durante la visualizzazione degli annunci sulla mappa:",
      error,
    );
  } finally {
    loadingAnnunci.value = false;
  }
};

const setQueryRoute = () => {
  const query = {
    immobile: filtroAnnunci.tipologiaImmobile
      ? filtroAnnunci.tipologiaImmobile
      : null,
    contratto: filtroAnnunci.tipologiaContratto
      ? filtroAnnunci.tipologiaContratto
      : null,
    prezzoMin: filtroAnnunci.prezzoMin ? filtroAnnunci.prezzoMin : null,
    prezzoMax: filtroAnnunci.prezzoMax ? filtroAnnunci.prezzoMax : null,
    mqMin: filtroAnnunci.metriQuadriMin ? filtroAnnunci.metriQuadriMin : null,
    mqMax: filtroAnnunci.metriQuadriMax ? filtroAnnunci.metriQuadriMax : null,

    balconi: filtroAnnunci.balconi,
    garage: filtroAnnunci.garage,
    postiAuto: filtroAnnunci.postiAuto,
    giardino: filtroAnnunci.giardino,
    ascensore: filtroAnnunci.ascensore,
    portiere: filtroAnnunci.portiere,
    riscaldamento: filtroAnnunci.riscaldamentoCentralizzato,
    climatizzatore: filtroAnnunci.climatizzatori,
    pannelliSolari: filtroAnnunci.pannelliSolari,
    cantina: filtroAnnunci.cantina,
    soffitta: filtroAnnunci.soffitta,

    lat: filtroAnnunci.latCentro ? filtroAnnunci.latCentro : null,
    lon: filtroAnnunci.lonCentro ? filtroAnnunci.lonCentro : null,
    raggioKm: filtroAnnunci.raggioKm ? filtroAnnunci.raggioKm : null,
  };

  router.push({ query });
};

const setAnnunciResponse = (annunci) => {
  annunciResponse.value = [];

  annunci.forEach((annuncio) => {
    annunciResponse.value.push(
      reactive(new AnnuncioImmobiliareResponse(annuncio)),
    );
  });
};

watch(
  () => route.query,
  () => {

    setFiltro();

    if (route.query.lat && route.query.lon && route.query.raggioKm) {

      mostraAnnunciSullaMappa();
    }
  },
  { immediate: true },
);
</script>
