<template>

    <div class="flex flex-col gap-8 w-full overflow-y-auto items-start justify-start p-2 bg-white">

        <div class="luogo w-full">

            <div class="w-[90%] h-60">
                <Mappa :raggio="valoreDistanzaMassima" />
            </div>

            <div class="distanza-massima flex flex-col items-start justify-start">
                <label class="block text-lg font-semibold mb-1">Distanza massima dal centro (km)</label>
                <InputText v-model.number="valoreDistanzaMassima" class="w-full mb-4" />
                <Slider v-model="valoreDistanzaMassima" class="w-full" />
            </div>

        </div>

        <div class="tipologia-immobile flex flex-col items-start justify-start">
            <label class="block text-lg font-semibold mb-1">Tipologia immobile</label>
            <Select v-model="selectedTipologiaImmobile" :options="opzioniTipologiaImmobile" optionLabel="name"
                placeholder="Select a City" class="w-full md:w-56" />
        </div>

        <div class="prezzo-immobile flex flex-row gap-2">
            <div class="flex flex-col items-start justify-start">
                <label class="block text-lg font-semibold mb-1">Prezzo minimo</label>
                <InputNumber v-model="valorePrezzoMinimo" inputId="locale-german" locale="de-DE" :min="0" fluid />
            </div>
            <div class="flex flex-col items-start justify-start">
                <label class="block text-lg font-semibold mb-1">Prezzo massimo</label>
                <InputNumber v-model="valorePrezzoMassimo" inputId="locale-german" locale="de-DE" :min="0" fluid />
            </div>
        </div>

        <div class="dimensione-immobile flex flex-row gap-2">
            <div class="flex flex-col items-start justify-start">
                <label class="block text-lg font-semibold mb-1">Metri quadri minimo</label>
                <InputNumber v-model="valoreMetriQuadriMinimo" :min="0" fluid />
            </div>
            <div class="flex flex-col items-start justify-start">
                <label class="block text-lg font-semibold mb-1">Metri quadri massimo</label>
                <InputNumber v-model="valoreMetriQuadriMassimo" :min="0" fluid />
            </div>
        </div>

        <div class="altre-caratteristiche flex flex-col items-start justify-start">
            <label class="block text-lg font-semibold mb-1">Caratteristiche Aggiuntive</label>
            <div class="flex flex-row gap-4">
                <div class="flex flex-row items-start justify-start">
                    <ToggleSwitch v-model="val" />
                    <span class="">Balconi</span>
                </div>
                <div class="flex flex-row items-start justify-start">
                    <ToggleSwitch v-model="vl" />
                    <span class="">Garage</span>
                </div>
            </div>
        </div>
    </div>
    <!-- Bottone sempre visibile -->
    <Button class="!fixed !bottom-4 !left-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700">
        Applica filtro
    </Button>
</template>

<script setup>
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Slider from 'primevue/slider';
import ToggleSwitch from 'primevue/toggleswitch';
import Button from 'primevue/button';

import Mappa from '../ListaAnnunci/Mappa.vue'

import { CountryService } from "../../services/ComuniItalianiService";

import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute()


const selectedTipologiaImmobile = ref(ref({ name: route.query.immobile }));
const opzioniTipologiaImmobile = ref([
    { name: 'APPARTAMENTO' },
    { name: 'TERRENO' },
    { name: 'UFFICIO' },
    { name: 'POSTOAUTO' },
    { name: 'ALTRO' }
]);

const valorePrezzoMinimo = ref();
const valorePrezzoMassimo = ref();
const valoreMetriQuadriMinimo = ref();
const valoreMetriQuadriMassimo = ref();
const valoreDistanzaMassima = ref(5);



</script>