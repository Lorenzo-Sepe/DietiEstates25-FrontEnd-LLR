<template>
  <div class="w-full h-full flex flex-col bg-gray-100">
    <div class="intestazione w-full p-4 items-start justify-start flex flex-col">
      <h2>
        {{ numeroAnnunci }}
        {{ formattaInPlurale(route.query.immobile, numeroAnnunci) }} in
        {{ route.query.contratto }} a {{ route.query.comune }}
      </h2>
    </div>

    <div class="w-full h-full flex flex-row gap-2 mt-2 items-start justify-start">
      <div class="hidden menuLaterale  flex flex-col gap-2 w-120 h-full p-2 md:block mx-2">
        <ContenutoMenuFiltro />
      </div>

      <div class="lista-annunci w-full min-h-screen md:w-[85%] lg:w-full flex flex-col gap-4">
        <div class="menuSuperiore flex flex-row border-b-2 border-b-gray-400 p-2 gap-2 mb-4 mx-2 justify-between">
          <div class="block flex justify-center md:hidden">
            <Drawer v-model:visible="visible" header="Filtro">
              <ContenutoMenuFiltro @chiudiDrawer="visible = false" />
              
            </Drawer>
            <Button class="!w-16" label="Filtra" @click="visible = true" />
          </div>

          <div class="filtro-ordine">
            <div class="filtro-schermi-grandi hidden md:block flex flex-row justify-end">
              <label for="ordine-selectbutton" class="text-lg font-semibold mr-2">Ordina per:</label>
              <SelectButton id="ordine-selectbutton" v-model="selectedOrdine" :options="opzioniDiOrdinamento"
                @click="setOrdineToQueryRoute" />
            </div>
            <div class="filtro-schermi-piccolo block md:hidden flex flex-col">
              <label for="ordine-select" class="text-lg font-semibold mb-1">Ordina per</label>
              <Select id="ordine-select" v-model="selectedOrdine" :options="opzioniDiOrdinamento" class="w-40"
                @change="setOrdineToQueryRoute" />
            </div>
          </div>
        </div>

        <ScheletroLista v-if="loadingAnnunci" />

        <div class="w-full h-full mx-2" v-else>
          <ListaAnnunci v-if="annunciResponse.length > 0" :annunci="annunciResponse" />
          <div class="w-[95%] h-150" v-else>
            <h3>Non sono stati trovati annunci</h3>
          </div>
        </div>

        <div class="my-2 mx-2">
          <Paginator v-model:first="resetPage" :rows="5" :totalRecords="numeroAnnunci" @page="setPage">
          </Paginator>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import ListaAnnunci from "../components/ListaAnnunci/ListaAnnunci.vue";
import ContenutoMenuFiltro from "../components/ListaAnnunci/ContenutoMenuFiltro.vue";
import ScheletroLista from "../components/ListaAnnunci/ScheletroLista.vue";
import { FiltroAnnuncioRequest } from "../dto/FiltroAnnunciRequest.js";
import { AnnuncioImmobiliareResponse } from "../dto/Response/AnnuncioImmobiliareResponse.js";
import AnnunciImmobiliService from "../services/AnnunciImmobiliService.js";

import Button from "primevue/button";
import Drawer from "primevue/drawer";
import Paginator from "primevue/paginator";
import SelectButton from "primevue/selectbutton";
import Select from "primevue/select";

const router = useRouter();
const route = useRoute();

const selectedOrdine = ref("Più recenti");
const opzioniDiOrdinamento = ref([
  "Più recenti",
  "Meno recenti",
  "Più economici",
  "Meno economici",
]);

const filtroAnnunci = reactive(new FiltroAnnuncioRequest());
const visible = ref(false);
const loadingAnnunci = ref(true);
const numeroAnnunci = ref(0);
const annunciResponse = ref([]);

const resetPage = ref(0);

onMounted(() => {
  mostraAnnunci();
});

const mostraAnnunci = async () => {
  try {
    loadingAnnunci.value = true;
    numeroAnnunci.value = await getNumeroAnnunci();
    const annunci = await getAnnunci();
    setAnnunciResponse(annunci);
    console.log("Annunci response: ", annunciResponse.value);
  } catch (error) {
    console.error("Errore durante il caricamento degli annunci:", error);
  } finally {
    loadingAnnunci.value = false;
  }
};

const getNumeroAnnunci = async () => {
  setFiltro();

  return await AnnunciImmobiliService.getNumeroAnnunci(filtroAnnunci);
};

const getAnnunci = async () => {
  setFiltro();

  try {
    const response = await AnnunciImmobiliService.getAnnunci(filtroAnnunci);

    // Mappare l'array generico in un array di istanze di AnnuncioImmobiliareResponse
    const annunci = response.map(
      (annuncioData) => new AnnuncioImmobiliareResponse(annuncioData),
    );

    // Ora `annunci` è un array di oggetti di tipo AnnuncioImmobiliareResponse
    return annunci;
  } catch (error) {
    console.error("Errore durante il caricamento degli annunci:", error);
    throw error; // Rilancia l'errore per una gestione successiva
  }
};

const setNumeroPagina = () => {
  filtroAnnunci.numeroPagina = route.query.page
    ? parseInt(route.query.page)
    : 1;
};

const setOrdini = () => {
  filtroAnnunci.ordinePrezzoAsc = route.query.ordinePrezzoAsc
    ? route.query.ordinePrezzoAsc
    : false;
  filtroAnnunci.ordinePrezzoDesc = route.query.ordinePrezzoDesc
    ? route.query.ordinePrezzoDesc
    : false;
  filtroAnnunci.ordineDataAsc = route.query.ordineDataAsc
    ? route.query.ordineDataAsc
    : false;
  filtroAnnunci.ordineDataDesc = route.query.ordineDataDesc
    ? route.query.ordineDataDesc
    : false;
};

const setTipologie = () => {
  filtroAnnunci.tipologiaImmobile = route.query.immobile
    ? route.query.immobile
    : null;
  filtroAnnunci.tipologiaContratto = route.query.contratto
    ? route.query.contratto
    : null;
};

const setPrezziEDimensioni = () => {
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
};

const setCaratteristiche = () => {
  filtroAnnunci.latCentro = route.query.lat ? route.query.lat : null;
  filtroAnnunci.lonCentro = route.query.lon ? route.query.lon : null;
  filtroAnnunci.raggioKm = route.query.raggioKm ? route.query.raggioKm : null;
  filtroAnnunci.provincia = route.query.comune ? route.query.comune : null;
  filtroAnnunci.balconi = route.query.balconi ? route.query.balconi : null;
  filtroAnnunci.garage = route.query.garage ? route.query.garage : null;
  filtroAnnunci.postiAuto = route.query.postiAuto
    ? route.query.postiAuto
    : null;
  filtroAnnunci.giardino = route.query.giardino ? route.query.giardino : null;
  filtroAnnunci.ascensore = route.query.ascensore
    ? route.query.ascensore
    : null;
  filtroAnnunci.portiere = route.query.portiere ? route.query.portiere : null;
  filtroAnnunci.riscaldamentoCentralizzato = route.query.riscaldamento
    ? route.query.riscaldamento
    : null;
  filtroAnnunci.climatizzatore = route.query.climatizzatore
    ? route.query.climatizzatore
    : null;
  filtroAnnunci.pannelliSolari = route.query.pannelli
    ? route.query.pannelli
    : null;
  filtroAnnunci.cantina = route.query.cantina ? route.query.cantina : null;
  filtroAnnunci.soffitta = route.query.soffitta ? route.query.soffitta : null;
};

const setAgente = () => {
  filtroAnnunci.agenteCreatoreAnnuncio = route.query.agenteCreatoreAnnuncio
    ? route.query.agenteCreatoreAnnuncio
    : null;
};

const setFiltro = async () => {
  setNumeroPagina();
  setOrdini();
  setTipologie();
  setPrezziEDimensioni();
  setCaratteristiche();
  setAgente();
};

const setAnnunciResponse = (annunci) => {
  annunciResponse.value = [];

  annunci.forEach((annuncio) => {
    annunciResponse.value.push(
      reactive(new AnnuncioImmobiliareResponse(annuncio)),
    );
  });
};

watch(route, (newRoute) => {
  resetPage.value = Number(route.query.page - 1 || 1 - 1) * 5;

  setValoreOrdineBottoni();
  mostraAnnunci();
});

const setValoreOrdineBottoni = () => {
  if (route.query.ordineDataAsc == "true") {
    selectedOrdine.value = "Meno recenti";
  } else if (route.query.ordineDataDesc == "true") {
    selectedOrdine.value = "Più recenti";
  } else if (route.query.ordinePrezzoAsc == "true") {
    selectedOrdine.value = "Più economici";
  } else if (route.query.ordinePrezzoDesc == "true") {
    selectedOrdine.value = "Meno economici";
  } else {
    selectedOrdine.value = "Più recenti";
  }
};

const setOrdineToQueryRoute = () => {
  switch (selectedOrdine.value) {
    case "Più recenti":
      router.push({
        query: {
          ...route.query,
          page: 1, // mantieni i parametri attuali
          ordineDataAsc: false,
          ordineDataDesc: true,
          ordinePrezzoAsc: false,
          ordinePrezzoDesc: false,
        },
      });
      break;

    case "Meno recenti":
      router.push({
        query: {
          ...route.query,
          page: 1, // mantieni i parametri attuali
          ordineDataAsc: true,
          ordineDataDesc: false,
          ordinePrezzoAsc: false,
          ordinePrezzoDesc: false,
        },
      });
      break;

    case "Più economici":
      router.push({
        query: {
          ...route.query,
          page: 1, // mantieni i parametri attuali
          ordineDataAsc: false,
          ordineDataDesc: false,
          ordinePrezzoAsc: true,
          ordinePrezzoDesc: false,
        },
      });
      break;

    case "Meno economici":
      router.push({
        query: {
          ...route.query,
          page: 1, // mantieni i parametri attuali
          ordineDataAsc: false,
          ordineDataDesc: false,
          ordinePrezzoAsc: false,
          ordinePrezzoDesc: true,
        },
      });
      break;
  }
};

const setPage = (event) => {
  router.push({
    query: {
      ...route.query, // mantieni i parametri attuali
      page: event.page + 1,
    },
  });
};

function formattaInPlurale(tipologiaImmobile, nuemroAnnunci) {
  if (nuemroAnnunci == 0 || nuemroAnnunci > 1) {
    switch (tipologiaImmobile) {
      case "APPARTAMENTO":
        return "Appartamenti";
      case "TERRENO":
        return "Terreni";
      case "UFFICIO":
        return "Uffici";
      case "POSTOAUTO":
        return "Posti auto";
      case "ALTRO":
        return "Immobili";
      default:
        return tipologiaImmobile;
    }
  }
}
</script>
