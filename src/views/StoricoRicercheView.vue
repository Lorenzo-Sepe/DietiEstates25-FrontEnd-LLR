<template>
  <div class="p-4 w-full">
    <h2 class="text-2xl font-bold mb-4">Ricerche Annunci Effettuate</h2>

       <Button label="Mostra Ricerche Effettuate" icon="pi pi-history" @click="visible = true" />

    <!-- Dialog con DataTable -->
    <Dialog
      header="Ricerche Annunci Effettuate"
      v-model:visible="visible"
      :modal="true"
      :style="{ width: '80vw' }"
    >
      <StoricoRicercheTable :ricerche="ricerche" :onSelectRicerca="onSelectRicerca" />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted,reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import StoricoRicercheService from "../services/StoricoRicercheService";
import StoricoRicercheTable from "../components/Dialogs/StoricoRicerchePopUp.vue";

import Button from "primevue/button";
import Dialog from "primevue/dialog";

const visible = ref(false);

const router = useRouter();
const route = useRoute();
// Stato
const ricerche = ref([]);
const filtro = ref(null);

// Caratteristiche attive
const caratteristicheAbilitate = computed(() => {
  if (!filtro.value) return [];

  const caratteristicheConsentite = [
    "balconi",
    "garage",
    "postiAuto",
    "giardino",
    "ascensore",
    "portiere",
    "riscaldamentoCentralizzato",
    "climatizzatori",
    "pannelliSolari",
    "cantina",
    "soffitta",
  ];

  return Object.entries(filtro.value)
    .filter(([k, v]) => caratteristicheConsentite.includes(k)) // 🔹 tieni solo quelli della whitelist
    .map(([k, v]) => ({
      nome: k,
      valore: v === true, // null o false diventano false
    }));
});

// Simula caricamento da backend
onMounted(async () => {
  try {
    ricerche.value = await StoricoRicercheService.getStoricoRicercheUtente();

    console.log("Storico ricerche:", ricerche.value);
  } catch (err) {
    console.error("Errore caricamento storico ricerche:", err);
  }
});

const filtroAnnunci = reactive({
  numeroPagina: 1,
  numeroDiElementiPerPagina: 5,
  ordinePrezzoAsc: false,
  ordinePrezzoDesc: false,
  ordineDataAsc: false,
  ordineDataDesc: true,
  titolo: null,
  tipologiaImmobile: "APPARTAMENTO",
  tipologiaContratto: "AFFITTO",
  prezzoMin: 150.0,
  prezzoMax: null,
  metriQuadriMin: null,
  metriQuadriMax: null,
  provincia: null,
  latCentro: null,
  lonCentro: null,
  raggioKm: null,
  balconi: null,
  garage: null,
  postiAuto: null,
  giardino: null,
  ascensore: null,
  portiere: null,
  riscaldamentoCentralizzato: null,
  climatizzatori: null,
  pannelliSolari: null,
  cantina: null,
  soffitta: null,
  descrizioneAggiuntiva: null,
  agenteCreatoreAnnuncio: null
})

// Quando seleziono una ricerca, apro il dettaglio filtro
function onSelectRicerca(e) {
  console.log("Ricerca selezionata:", e.data);
   try {
    Object.assign(filtroAnnunci, JSON.parse(e.data.filtroUsatoJson))
    console.log("JSON.parse:", JSON.parse(e.data.filtroUsatoJson))
    console.log("Filtro ricostruito:", filtroAnnunci)
    clickCerca()
  } catch (err) {
    console.error("Errore parsing JSON:", err)
  }
}

const clickCerca = () => {
    router.push({
    path: "/annunci",
    query: {
      ...route.query,
      comune: filtroAnnunci.locality?.length === 1
        ? filtroAnnunci.locality[0]
        : null,
      immobile: filtroAnnunci.tipologiaImmobile,
      contratto: filtroAnnunci.tipologiaContratto,
      page: 1,
      raggio: filtroAnnunci.raggioKm,
      lat: filtroAnnunci.latCentro,
      lon: filtroAnnunci.lonCentro,
      prezzoMin: filtroAnnunci.prezzoMin,
      prezzoMax: filtroAnnunci.prezzoMax,
      mqMin: filtroAnnunci.metriQuadriMin,
      mqMax: filtroAnnunci.metriQuadriMax,

      balconi: filtroAnnunci.balconi,
      garage: filtroAnnunci.garage,
      postiAuto: filtroAnnunci.postiAuto,
      giardino: filtroAnnunci.giardino,
      ascensore: filtroAnnunci.ascensore,
      portiere: filtroAnnunci.portiere,
      riscaldamentoCentralizzato: filtroAnnunci.riscaldamentoCentralizzato,
      climatizzatore: filtroAnnunci.climatizzatori,
      pannelliSolari: filtroAnnunci.pannelliSolari,
      cantina: filtroAnnunci.cantina,
      soffitta:filtroAnnunci.soffitta,
    },
  });


};

function formatTimeAgo(dateArray) {
  if (!dateArray || dateArray.length < 3) return "---";

  // accetta anche ora, minuti, secondi (default = 0)
  const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);
  const now = new Date();

  const diffMs = now - date;
  if (diffMs < 0) return "---"; // caso futuro

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  // Anni → data precisa
  if (diffYear >= 1) {
    return date.toLocaleDateString("it-IT");
  }

  // Mesi
  if (diffMonth >= 1) {
    return diffMonth === 1 ? "un mese fa" : `${diffMonth} mesi fa`;
  }

  // Settimane
  if (diffWeek >= 1) {
    return diffWeek === 1 ? "una settimana fa" : `${diffWeek} settimane fa`;
  }

  // Giorni
  if (diffDay >= 1) {
    return diffDay === 1 ? "ieri" : `${diffDay} giorni fa`;
  }

  // Ore
  if (diffHour >= 1) {
    return diffHour === 1 ? "un'ora fa" : `${diffHour} ore fa`;
  }

  // Minuti
  if (diffMin >= 1) {
    return diffMin === 1 ? "un minuto fa" : `${diffMin} minuti fa`;
  }

  // Secondi
  return "pochi secondi fa";
}


</script>
