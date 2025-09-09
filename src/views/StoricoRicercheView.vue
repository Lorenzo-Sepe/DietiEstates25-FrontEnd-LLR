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




</script>
