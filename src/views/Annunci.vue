<template>

    <div class="w-full flex flex-row gap-2">

        <div class="menuLaterale w-115 h-screen p-4 overflow-y-auto hidden md:block">
            <ContenutoMenuFiltro />
        </div>

        <div class="lista-annunci w-full bg-gray-200 flex flex-col gap-4 mt-4">

            <div class="flex border-b border-b-2 border-b-gray-400 p-4 justify-start gap-4 w-auto mb-4 block md:hidden">
                <div class="card flex justify-center">
                    <Drawer v-model:visible="visible" header="Filtro">
                        <ContenutoMenuFiltro />
                    </Drawer>
                    <Button icon="pi pi-arrow-right" @click="visible = true" />
                </div>
            </div>

            <ListaAnnunci :annunci="annunciResponse" />

            <div>
                <Paginator :rows="5" :totalRecords="numeroAnnunci"></Paginator>
            </div>

        </div>

    </div>

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import ListaAnnunci from '../components/ListaAnnunci/ListaAnnunci.vue';
import ContenutoMenuFiltro from '../components/ListaAnnunci/ContenutoMenuFiltro.vue';
import { FiltroAnnuncioRequest } from '../dto/FiltroAnnunciRequest.js';
import { AnnuncioImmobiliareResponse } from '../dto/Response/AnnuncioImmobiliareResponse.js';
import AnnunciImmobiliService from '../services/AnnunciImmobiliService.js';

import Button from 'primevue/button';
import Drawer from 'primevue/drawer';
import Paginator from 'primevue/paginator';

const router = useRouter();
const route = useRoute()

const filtroAnnunci = reactive(new FiltroAnnuncioRequest());
const visible = ref(false);
const loadingAnnunci = ref(true);
const numeroAnnunci = ref(0);
const annunciResponse = ref([]);

onMounted( async () => {

    try {

        numeroAnnunci.value = await getNumeroAnnunci();
        const annunci = await getAnnunci();
        setAnnunciResponse(annunci);
        console.log("Annunci response: ", annunciResponse.value);

    } catch (error) {

        console.error("Errore durante il caricamento degli annunci:", error);

    } finally {

        loadingAnnunci.value = false;
    }

});

const getNumeroAnnunci = async () => {

    setFiltro();

    return await AnnunciImmobiliService.getNumeroAnnunci(filtroAnnunci);
}

const getAnnunci = async () => {

    setFiltro();

    return AnnunciImmobiliService.getAnnunciByAnonimo(filtroAnnunci);
}

const setFiltro = async () => {

    filtroAnnunci.numeroPagina = route.query.page ? parseInt(route.query.page) : 1;
    filtroAnnunci.titolo = null;
    filtroAnnunci.tipologiaImmobile = route.query.immobile ? route.query.immobile : null;
    filtroAnnunci.tipologiaContratto = route.query.contratto ? route.query.contratto : null;
    filtroAnnunci.prezzoMin = route.query.prezzoMin ? parseInt(route.query.prezzoMin) : null;
    filtroAnnunci.prezzoMax = route.query.prezzoMax ? parseInt(route.query.prezzoMax) : null;
    filtroAnnunci.metriQuadriMin = route.query.mqMin ? parseInt(route.query.mqMin) : null;
    filtroAnnunci.metriQuadriMax = route.query.mqMax ? parseInt(route.query.mqMax) : null;
    filtroAnnunci.provincia = route.query.title ? route.query.title : null;
    filtroAnnunci.latCentro = route.query.lat ? parseFloat(route.query.lat) : null;
    filtroAnnunci.lonCentro = route.query.lon ? parseFloat(route.query.lon) : null;
    filtroAnnunci.raggioKm = route.query.raggio ? parseInt(route.query.raggio) : null;
    filtroAnnunci.balconi = route.query.balconi ? route.query.balconi : null;
    filtroAnnunci.garage = route.query.garage ? route.query.garage : null;
    filtroAnnunci.pannelliSolari = route.query.pannelli ? route.query.pannelli : null;

}

const setAnnunciResponse = (annunci) => {

    annunci.forEach(annuncio => {
        
        annunciResponse.value.push(reactive(new AnnuncioImmobiliareResponse(annuncio)));
    });
}

</script>