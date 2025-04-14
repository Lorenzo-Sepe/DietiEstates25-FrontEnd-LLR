<template>

    <div class="w-full h-full">

        <div class="w-full h-full flex flex-row gap-2 my-4">

            <div class="filtro-laterale w-120 h-120 hidden md:block mx-2">
                <ContenutoMenuFiltro :filtro="filtroAnnunci" />
            </div>

            <div class="area-centrale flex flex-col w-full gap-2">

                <div class="area-superiore w-full flex items-start block md:hidden">
                    <Button label="Filtro (schermi piccoli)" />
                </div>

                <div class="mappa w-full h-120">
                    <Mappa :annunci="annunciResponse" :loading="loadingAnnunci" />
                </div>

            </div>

        </div>

        <div class="area-inferiore w-full flex items-center px-8">
            <Button class="w-full" label="Vedi risultati" />
        </div>

    </div>

</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';

import AnnunciImmobiliService from '../services/AnnunciImmobiliService.js';
import { FiltroAnnuncioRequest } from '../dto/FiltroAnnunciRequest.js';
import { AnnuncioImmobiliareResponse } from '../dto/Response/AnnuncioImmobiliareResponse.js';

import Button from 'primevue/button';

import ContenutoMenuFiltro from '../components/RicercaNellaMappa/ContenutoMenuFiltro.vue';
import Mappa from '../components/RicercaNellaMappa/Mappa.vue';

const filtroAnnunci = reactive(new FiltroAnnuncioRequest());
const annunciResponse = ref([]);
const loadingAnnunci = ref(false);

const mostraAnnunciSullaMappa = () => {

    try{

    }catch (error) {
        console.error("Errore durante la visualizzazione degli annunci sulla mappa:", error);
    }finally{

    }
}

const getAnnunci = async () => {

    await AnnunciImmobiliService.getAnnunciByAnonimo(filtroAnnunci)
}

const setFiltro = async () => {

//Immobile
filtroAnnunci.tipologiaImmobile = route.query.immobile ? route.query.immobile : null;
filtroAnnunci.tipologiaContratto = route.query.contratto ? route.query.contratto : null;
filtroAnnunci.prezzoMin = route.query.prezzoMin ? parseInt(route.query.prezzoMin) : null;
filtroAnnunci.prezzoMax = route.query.prezzoMax ? parseInt(route.query.prezzoMax) : null;
filtroAnnunci.metriQuadriMin = route.query.mqMin ? parseInt(route.query.mqMin) : null;
filtroAnnunci.metriQuadriMax = route.query.mqMax ? parseInt(route.query.mqMax) : null;

//Caratteristiche aggiuntive
filtroAnnunci.balconi = route.query.balconi ? route.query.balconi : null;
filtroAnnunci.garage = route.query.garage ? route.query.garage : null;
filtroAnnunci.postiAuto = route.query.postiAuto ? route.query.postiAuto : null;
filtroAnnunci.giardino = route.query.giardino ? route.query.giardino : null;
filtroAnnunci.ascensore = route.query.ascensore ? route.query.ascensore : null;
filtroAnnunci.portiere = route.query.portiere ? route.query.portiere : null;
filtroAnnunci.riscaldamentoCentralizzato = route.query.riscaldamento ? route.query.riscaldamento : null;
filtroAnnunci.climatizzatori = route.query.climatizzatore ? route.query.climatizzatore : null;
filtroAnnunci.pannelliSolari = route.query.pannelli ? route.query.pannelli : null;
filtroAnnunci.cantina = route.query.cantina ? route.query.cantina : null;
filtroAnnunci.soffitta = route.query.soffitta ? route.query.soffitta : null;

//Localizzazione
filtroAnnunci.latCentro = route.query.lat ? parseFloat(route.query.lat) : null;
filtroAnnunci.lonCentro = route.query.lon ? parseFloat(route.query.lon) : null;
filtroAnnunci.raggioKm = route.query.raggio ? parseFloat(route.query.raggio) : null;

//Tutti gli annunci
filtroAnnunci.numeroPagina = null;
filtroAnnunci.numeroDiElementiPerPagina = null;

}

const setAnnunciResponse = (annunci) => {

    annunciResponse.value = [];

    annunci.forEach(annuncio => {

        annunciResponse.value.push(reactive(new AnnuncioImmobiliareResponse(annuncio)));
    });
}


</script>