<template>

    <div class="flex flex-col gap-8 w-full items-start justify-start p-2">

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

        <div class="distanza-massima flex flex-col items-start justify-start">
            <label class="block text-lg font-semibold mb-1">Distanza massima</label>
            <InputText v-model.number="valoreDistanzaMassima" class="w-full mb-4" />
            <Slider v-model="valoreDistanzaMassima" class="w-full" />
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

</template>

<script setup>
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Slider from 'primevue/slider';
import ToggleSwitch from 'primevue/toggleswitch';

import { ref } from "vue";

const selectedTipologiaImmobile = ref();
const opzioniTipologiaImmobile = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);

const valorePrezzoMinimo = ref(0);
const valorePrezzoMassimo = ref(0);
const valoreMetriQuadriMinimo = ref(0);
const valoreMetriQuadriMassimo = ref(0);
const valoreDistanzaMassima = ref(0);

</script>