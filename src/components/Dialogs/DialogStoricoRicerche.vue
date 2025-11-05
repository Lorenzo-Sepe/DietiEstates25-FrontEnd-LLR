<template>

    <div>

        <Dialog header="Ricerche Annunci Effettuate" v-model:visible="visible" :modal="true" :style="{ width: '80vw' }">

            <ScheletroDatatable v-if="scheletroCaricamento"></ScheletroDatatable>

            <StoricoRicercheTable v-else :ricerche="ricerche" :onSelectRicerca="onSelectRicerca" />

        </Dialog>

    </div>

</template>

<script setup>

import { ref, onMounted, reactive, defineEmits } from "vue";

import { useRouter, useRoute } from "vue-router";

import Dialog from 'primevue/dialog';

import ScheletroDatatable from "../ScheletroDatatable.vue";
import StoricoRicercheTable from "./StoricoRicerchePopUp.vue";

import StoricoRicercheService from "../../services/StoricoRicercheService.js";

const router = useRouter();
const route = useRoute();
// Stato
const ricerche = ref([]);
const scheletroCaricamento = ref(true);
const visible = ref(false);


const emit = defineEmits(['chiudiDrawer']);


// Simula caricamento da backend
onMounted(async () => {

    try {

        ricerche.value = await StoricoRicercheService.getStoricoRicercheUtente();
        scheletroCaricamento.value = false;

    } catch (err) {
        console.error("Errore caricamento storico ricerche:", err);
        scheletroCaricamento.value = false;

    }
});

const caricaRicerche = async () => {

    scheletroCaricamento.value = true;

    try {
        ricerche.value = await StoricoRicercheService.getStoricoRicercheUtente();
    } catch (err) {
        console.error("Errore caricamento storico ricerche:", err);
    }

    scheletroCaricamento.value = false;
}

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
    prezzoMin: null,
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
   
    try {

        Object.assign(filtroAnnunci, JSON.parse(e.data.filtroUsatoJson))
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
            comune: filtroAnnunci.provincia,
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
            soffitta: filtroAnnunci.soffitta,
        },
    });
};

function apriDialog() {
    
    visible.value = true
    emit('chiudiDrawer')
    caricaRicerche()
}

defineExpose({ apriDialog })

</script>