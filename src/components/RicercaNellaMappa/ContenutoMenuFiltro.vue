<template>

    <div class="flex flex-col gap-8 w-full h-full overflow-y-auto items-start justify-start p-2 bg-white">

        <div class="tipologia-immobile flex flex-col items-start justify-start">
            <label class="block text-lg font-semibold mb-1">Tipologia immobile</label>
            <Select v-model="selectedTipologiaImmobile" :options="opzioniTipologiaImmobile" optionLabel="name"
                placeholder="Select a City" class="w-full md:w-56" @change="buckupSelectedImmobile" />
        </div>

        <div class="contratto-immobile flex flex-col items-start justify-start">
            <label class="block text-lg font-semibold mb-1">Tipologia contratto</label>
            <div class="card flex justify-center">
                <SelectButton v-model="selectedContratto" :options="opzioniContratto" @click="setQueryContratto" />
            </div>
        </div>

        <div class="prezzo-immobile flex flex-row gap-2">
            <div class="flex flex-col items-start justify-start">
                <label class="block text-lg font-semibold mb-1">Prezzo minimo</label>
                <InputNumber @value-change="setQueryPrezzoMin" v-model="valorePrezzoMinimo" inputId="locale-german"
                    locale="de-DE" :min="0" fluid />
            </div>
            <div class="flex flex-col items-start justify-start">
                <label class="block text-lg font-semibold mb-1">Prezzo massimo</label>
                <InputNumber @value-change="setQueryPrezzoMax" v-model="valorePrezzoMassimo" inputId="locale-german"
                    locale="de-DE" :min="0" fluid />
            </div>
        </div>

        <div class="dimensione-immobile flex flex-row gap-2">
            <div class="flex flex-col items-start justify-start">
                <label class="block text-lg font-semibold mb-1">Metri quadri minimo</label>
                <InputNumber @value-change="setQueryMqMin" v-model="valoreMetriQuadriMinimo" :min="0" fluid />
            </div>
            <div class="flex flex-col items-start justify-start">
                <label class="block text-lg font-semibold mb-1">Metri quadri massimo</label>
                <InputNumber @value-change="setQueryMqMax" v-model="valoreMetriQuadriMassimo" :min="0" fluid />
            </div>
        </div>

        <div class="altre-caratteristiche flex flex-col items-start justify-start gap-2">
            <label class="block text-lg font-semibold mb-1">Caratteristiche Aggiuntive</label>

            <div class="flex flex-row items-start justify-start">
                <ToggleSwitch v-model="caratteristicheAggiuntive.balconi" @change="setQueryCaratteristiche" />
                <span class="">Balconi</span>
            </div>
            <div class="flex flex-row items-start justify-start">
                <ToggleSwitch v-model="caratteristicheAggiuntive.garage" @change="setQueryCaratteristiche" />
                <span class="">Garage</span>
            </div>
            <div class="flex flex-row items-start justify-start">
                <ToggleSwitch v-model="caratteristicheAggiuntive.postiAuto"  @change="setQueryCaratteristiche" />
                <span class="">Posti auto</span>
            </div>
            <div class="flex flex-row items-start justify-start">
                <ToggleSwitch v-model="caratteristicheAggiuntive.giardino"  @change="setQueryCaratteristiche" />
                <span class="">Giardino</span>
            </div>
            <div class="flex flex-row items-start justify-start">
                <ToggleSwitch v-model="caratteristicheAggiuntive.ascensore"  @change="setQueryCaratteristiche" />
                <span class="">Ascensore</span>
            </div>
            <div class="flex flex-row items-start justify-start">
                <ToggleSwitch v-model="caratteristicheAggiuntive.portiere"  @change="setQueryCaratteristiche" />
                <span class="">Portiere</span>
            </div>
            <div class="flex flex-row items-start justify-start">
                <ToggleSwitch v-model="caratteristicheAggiuntive.riscaldamentoCentralizzato"
                @change="setQueryCaratteristiche" />
                <span class="">Riscaldamento Centralizzato</span>
            </div>
            <div class="flex flex-row items-start justify-start">
                <ToggleSwitch v-model="caratteristicheAggiuntive.climatizzatori"  @change="setQueryCaratteristiche" />
                <span class="">Climatizzatori</span>
            </div>
            <div class="flex flex-row items-start justify-start">
                <ToggleSwitch v-model="caratteristicheAggiuntive.pannelliSolari"  @change="setQueryCaratteristiche" />
                <span class="">Pannelli Solari</span>
            </div>
            <div class="flex flex-row items-start justify-start">
                <ToggleSwitch v-model="caratteristicheAggiuntive.cantina"  @change="setQueryCaratteristiche" />
                <span class="">Cantina</span>
            </div>
            <div class="flex flex-row items-start justify-start">
                <ToggleSwitch v-model="caratteristicheAggiuntive.soffitta"  @change="setQueryCaratteristiche" />
                <span class="">Soffitta</span>
            </div>

        </div>
    </div>
</template>

<script setup>
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import ToggleSwitch from 'primevue/toggleswitch';
import SelectButton from 'primevue/selectbutton';

import { ref, onMounted, watch, defineProps } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { parse } from 'vue/compiler-sfc';

const router = useRouter();
const route = useRoute()

const selectedTipologiaImmobile = ref();
selectedTipologiaImmobile.value = route.query.immobile ? ref({ name: route.query.immobile }) : null
const opzioniTipologiaImmobile = ref([
    { name: 'APPARTAMENTO' },
    { name: 'TERRENO' },
    { name: 'UFFICIO' },
    { name: 'POSTOAUTO' },
    { name: 'ALTRO' }
]);
const selectedTipologiaImmobileBackup = ref(route.query.immobile)
const buckupSelectedImmobile = () => {
    selectedTipologiaImmobileBackup.value = selectedTipologiaImmobile.value.name;
    setQueryImmobile();
}

const selectedContratto = ref(route.query.contratto);
const opzioniContratto = ref(['AFFITTO', 'VENDITA']);

const valorePrezzoMinimo = ref(parseInt(route.query.prezzoMin));
const valorePrezzoMassimo = ref(parseInt(route.query.prezzoMax));
const valoreMetriQuadriMinimo = ref(parseInt(route.query.mqMin));
const valoreMetriQuadriMassimo = ref(parseInt(route.query.mqMax));

const caratteristicheAggiuntive = ({

    balconi: route.query.balconi=='true' ? true : false,
    garage: route.query.garage=='true' ? true : false,
    postiAuto: route.query.postiAuto=='true' ? true : false,
    giardino: route.query.giardino=='true' ? true : false,
    ascensore: route.query.ascensore=='true' ? true : false,
    portiere: route.query.portiere=='true' ? true : false,
    riscaldamentoCentralizzato: route.query.riscaldamento=='true' ? true : false,
    climatizzatori: route.query.climatizzatore=='true' ? true : false,
    pannelliSolari: route.query.pannelliSolari=='true' ? true : false,
    cantina: route.query.cantina=='true' ? true : false,
    soffitta: route.query.soffitta=='true' ? true : false,
})

const setQueryImmobile = () => {

    router.push({

        path: '/mappa-annunci',
        query: {
            ...route.query,
            immobile: selectedTipologiaImmobileBackup.value,
        }

    });

}

const setQueryContratto = () => {

    router.push({

        path: '/mappa-annunci',
        query: {
            ...route.query,
            contratto: selectedContratto.value,
        }

    });
}

const setQueryPrezzoMin = () => {

    router.push({

        path: '/mappa-annunci',
        query: {
            ...route.query,
            prezzoMin: valorePrezzoMinimo.value,
        }

    });
}

const setQueryPrezzoMax = () => {

    router.push({

        path: '/mappa-annunci',
        query: {
            ...route.query,
            prezzoMax: valorePrezzoMassimo.value,
        }

    });
}

const setQueryMqMin = () => {

    router.push({

        path: '/mappa-annunci',
        query: {
            ...route.query,
            mqMin: valoreMetriQuadriMinimo.value,
        }

    });
}

const setQueryMqMax = () => {

    router.push({

        path: '/mappa-annunci',
        query: {
            ...route.query,
            mqMax: valoreMetriQuadriMassimo.value,
        }

    });
}

const setQueryCaratteristiche = () => {

    router.push({

        path: '/mappa-annunci',
        query: {
            ...route.query,
            balconi: caratteristicheAggiuntive.balconi,
            garage: caratteristicheAggiuntive.garage,
            postiAuto: caratteristicheAggiuntive.postiAuto,
            giardino: caratteristicheAggiuntive.giardino,
            ascensore: caratteristicheAggiuntive.ascensore,
            portiere: caratteristicheAggiuntive.portiere,
            riscaldamento: caratteristicheAggiuntive.riscaldamentoCentralizzato,
            climatizzatore: caratteristicheAggiuntive.climatizzatori,
            pannelliSolari: caratteristicheAggiuntive.pannelliSolari,
            cantina: caratteristicheAggiuntive.cantina,
            soffitta: caratteristicheAggiuntive.soffitta,
        }

    });

}

watch(route, (newRoute) => {

    valorePrezzoMinimo.value = route.query.prezzoMin ? parseInt(route.query.prezzoMin) : null;
    valorePrezzoMassimo.value = route.query.prezzoMax ? parseInt(route.query.prezzoMax) : null;
    valoreMetriQuadriMinimo.value = route.query.mqMin ? parseInt(route.query.mqMin) : null;
    valoreMetriQuadriMassimo.value = route.query.mqMax ? parseInt(route.query.mqMax) : null;
    selectedTipologiaImmobile.value = route.query.immobile ? ref({ name: route.query.immobile }) : null;
    selectedContratto.value = route.query.contratto ? route.query.contratto : null;

    caratteristicheAggiuntive.balconi = route.query.balconi==true || route.query.balconi=='true' ? true : false
    caratteristicheAggiuntive.garage = route.query.garage==true || route.query.garage=='true' ? true : false
    caratteristicheAggiuntive.postiAuto = route.query.postiAuto==true || route.query.postiAuto=='true' ? true : false
    caratteristicheAggiuntive.giardino = route.query.giardino==true || route.query.giardino=='true' ? true : false
    caratteristicheAggiuntive.ascensore = route.query.ascensore==true || route.query.ascensore=='true' ? true : false
    caratteristicheAggiuntive.portiere = route.query.portiere==true || route.query.portiere=='true' ? true : false
    caratteristicheAggiuntive.riscaldamentoCentralizzato = route.query.riscaldamento==true || route.query.riscaldamento=='true' ? true : false
    caratteristicheAggiuntive.climatizzatori = route.query.climatizzatore==true || route.query.climatizzatore=='true' ? true : false
    caratteristicheAggiuntive.pannelliSolari = route.query.pannelliSolari==true || route.query.pannelliSolari=='true' ? true : false
    caratteristicheAggiuntive.cantina = route.query.cantina==true || route.query.cantina=='true' ? true : false
    caratteristicheAggiuntive.soffitta = route.query.soffitta==true || route.query.soffitta=='true' ? true : false
});



</script>