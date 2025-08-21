<template>
  <div class="p-4 w-full">
    <h2 class="text-2xl font-bold mb-4">Ricerche Annunci Effettuate</h2>

    <!-- DataTable con paginazione PrimeVue -->
<DataTable
  :value="ricerche"
  dataKey="id"
  paginator
  :rows="10"
  :rowsPerPageOptions="[5,10,20,50]"
  responsiveLayout="scroll"
  selectionMode="single"
  v-model:selection="selectedRicerca"
  @rowSelect="onSelectRicerca"
>
  <Column field="tipologiaImmobile" header="Tipologia" sortable>
    <template #body="slotProps">
      {{ slotProps.data.tipologiaImmobile ?? '---' }}
    </template>
  </Column>

  <Column field="tipologiaContratto" header="Contratto" sortable>
    <template #body="slotProps">
      {{ slotProps.data.tipologiaContratto ?? '---' }}
    </template>
  </Column>

  <Column field="prezzoMin" header="Prezzo Min" sortable>
    <template #body="slotProps">
      {{ slotProps.data.prezzoMin ?? '---' }}
    </template>
  </Column>

  <Column field="prezzoMax" header="Prezzo Max" sortable>
    <template #body="slotProps">
      {{ slotProps.data.prezzoMax ?? '---' }}
    </template>
  </Column>

  <!-- 🔹 Nuove colonne dai dati del filtro -->
  <Column field="metriQuadriMin" header="Metri Quadri Min" sortable>
    <template #body="slotProps">
      {{ slotProps.data.metriQuadriMin ?? '---' }}
    </template>
  </Column>

  <Column field="metriQuadriMax" header="Metri Quadri Max" sortable>
    <template #body="slotProps">
      {{ slotProps.data.metriQuadriMax ?? '---' }}
    </template>
  </Column>

  <Column field="provincia" header="Provincia" sortable>
    <template #body="slotProps">
      {{ slotProps.data.provincia ?? '---' }}
    </template>
  </Column>

  <Column field="raggioKm" header="Raggio (km)" sortable>
    <template #body="slotProps">
      {{ slotProps.data.raggioKm ?? '---' }}
    </template>
  </Column>

  <Column field="agenteCreatoreAnnuncio" header="Agente" sortable>
    <template #body="slotProps">
      {{ slotProps.data.agenteCreatoreAnnuncio ?? '---' }}
    </template>
  </Column>
</DataTable>



    <!-- Dialog con dettagli filtro -->
    <Dialog
      v-model:visible="filtroDialog"
      modal
      header="Dettagli Filtro Annuncio"
      class="w-[600px]"
    >
      <div v-if="filtro">


        <!-- Dati principali -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p><b>Titolo:</b> {{ filtro.titolo }}</p>
            <p><b>Tipologia:</b> {{ filtro.tipologiaImmobile }}</p>
            <p><b>Contratto:</b> {{ filtro.tipologiaContratto }}</p>
          </div>
          <div>
            <p><b>Prezzo:</b> {{ filtro.prezzoMin }} - {{ filtro.prezzoMax }}</p>
            <p><b>Metri quadri:</b> {{ filtro.metriQuadriMin }} - {{ filtro.metriQuadriMax }}</p>
          </div>
        </div>

        <!-- Posizione -->
        <div class="mb-4">
          <h3 class="font-semibold mb-2">Posizione</h3>
          <p><b>Provincia:</b> {{ filtro.provincia }}</p>
          <p><b>Lat/Lon:</b> {{ filtro.latCentro }} , {{ filtro.lonCentro }}</p>
          <p><b>Raggio km:</b> {{ filtro.raggioKm }}</p>
        </div>

        <!-- Caratteristiche aggiuntive -->
        <div class="mb-4">
        <h3 class="font-semibold mb-2">Caratteristiche</h3>
        <div class="flex flex-wrap gap-2">
            <Tag
            v-for="car in caratteristicheAbilitate"
            :key="car.nome"
            :value="car.nome"
            :severity="car.valore ? 'success' : 'danger'"
            />
        </div>
        </div>


        <!-- Staff -->
        <div>
          <h3 class="font-semibold mb-2">Agente</h3>
          <p>{{ filtro.agenteCreatoreAnnuncio }}</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import StoricoRicercheService from "../services/StoricoRicercheService";
import  DataTable  from "primevue/datatable";
import  Column  from "primevue/column";
import  Dialog  from "primevue/dialog";
import  Tag  from "primevue/tag";

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
    ricerche.value = data;
    console.log("Storico ricerche: ", ricerche.value);
  } catch (err) {
    console.error("Errore caricamento storico ricerche:", err);
  };
});

// Quando seleziono una ricerca, apro il dettaglio filtro
function onSelectRicerca(e) {
  filtro.value = JSON.parse(e.data.filtroUsatoJson);
  //filtroDialog.value = true;
  clickCerca();
}

const clickCerca = () => {
  const provincia = filtro.value.provincia;
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
    provincia,
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
      provincia: provincia,
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
</script>
