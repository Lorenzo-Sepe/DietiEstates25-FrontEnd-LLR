<template>
  <div class="p-4 w-full">
    <h2 class="text-2xl font-bold mb-4">Ricerche Annunci Effettuate</h2>

    <!-- DataTable con paginazione PrimeVue -->
    <DataTable
      :value="ricerche"
      dataKey="id"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      responsiveLayout="scroll"
      selectionMode="single"
      v-model:selection="selectedRicerca"
      @rowSelect="onSelectRicerca"
    >
      <Column field="dataRicerca" header="Data Ricerca" sortable>
        <template #body="slotProps">
              {{ formatTimeAgo(slotProps.data.createdAt) }}
        </template>
      </Column>

      <Column field="tipologiaImmobile" header="Tipologia" sortable>
        <template #body="slotProps">
          {{ slotProps.data.tipologiaImmobile ?? "---" }}
        </template>
      </Column>

      <Column field="tipologiaContratto" header="Contratto" sortable>
        <template #body="slotProps">
          {{ slotProps.data.tipologiaContratto ?? "---" }}
        </template>
      </Column>

      <Column field="prezzoMin" header="Prezzo Min" sortable>
        <template #body="slotProps">
          {{ slotProps.data.prezzoMin ?? "---" }}
        </template>
      </Column>

      <Column field="prezzoMax" header="Prezzo Max" sortable>
        <template #body="slotProps">
          {{ slotProps.data.prezzoMax ?? "---" }}
        </template>
      </Column>

      <!-- 🔹 Nuove colonne dai dati del filtro -->
      <Column field="metriQuadriMin" header="Metri Quadri Min" sortable>
        <template #body="slotProps">
          {{ slotProps.data.metriQuadriMin ?? "---" }}
        </template>
      </Column>

      <Column field="metriQuadriMax" header="Metri Quadri Max" sortable>
        <template #body="slotProps">
          {{ slotProps.data.metriQuadriMax ?? "---" }}
        </template>
      </Column>

      <Column field="Comune" header="Comune" sortable>
        <template #body="slotProps">
          {{
            slotProps.data.locality?.length === 1
              ? slotProps.data.locality[0]
              : slotProps.data.locality?.length
                ? slotProps.data.locality.join(", ")
                : "---"
          }}
        </template>
      </Column>

      <Column field="raggioKm" header="Raggio (km)" sortable>
        <template #body="slotProps">
          {{ slotProps.data.raggioKm ?? "---" }}
        </template>
      </Column>

      <Column field="agenteCreatoreAnnuncio" header="Agente" sortable>
        <template #body="slotProps">
          {{ slotProps.data.agenteCreatoreAnnuncio ?? "---" }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import StoricoRicercheService from "../services/StoricoRicercheService";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const router = useRouter();
const route = useRoute();
// Stato
const ricerche = ref([]);
const selectedRicerca = ref(null);
const filtroDialog = ref(false);
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
    const data = await StoricoRicercheService.getStoricoRicercheUtente();

    // Parse di filtroUsatoJson per ogni elemento
    ricerche.value = data.map((r) => ({
      ...r,
      filtroParsed: JSON.parse(r.filtroUsatoJson), // nuovo campo già parsato
    }));

    console.log("Storico ricerche:", ricerche.value);
  } catch (err) {
    console.error("Errore caricamento storico ricerche:", err);
  }
});

// Quando seleziono una ricerca, apro il dettaglio filtro
function onSelectRicerca(e) {
  filtro.value = e.data.filtroParsed;
  clickCerca();
}

const clickCerca = () => {
  const comune = filtro.value.provincia;
  const tipoImmobile = filtro.value.tipologiaImmobile;
  const tipoContratto = filtro.value.tipologiaContratto;
  const latitudine = filtro.value.latCentro;
  const longitudine = filtro.value.lonCentro;
  const raggioKm = filtro.value.raggioKm;
  const metriQuadriMax = filtro.value.metriQuadriMax;
  const metriQuadriMin = filtro.value.metriQuadriMin;
  const prezzoMax = filtro.value.prezzoMax;
  const prezzoMin = filtro.value.prezzoMin;

  console.log("Cerca cliccato con dati:", {
    comune,
    tipoImmobile,
    tipoContratto,
    latitudine,
    longitudine,
    raggioKm,
    metriQuadriMax,
    metriQuadriMin,
    prezzoMax,
    prezzoMin,
  });

  router.push({
    path: "/annunci",
    query: {
      ...route.query,
      comune: comune,
      immobile: tipoImmobile,
      contratto: tipoContratto,
      page: 1,
      lat: latitudine,
      lon: longitudine,
      ordineDataDesc: true,
      raggioKm: raggioKm,
      metriQuadriMax: metriQuadriMax,
      metriQuadriMin: metriQuadriMin,
      prezzoMax: prezzoMax,
      prezzoMin: prezzoMin,
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
