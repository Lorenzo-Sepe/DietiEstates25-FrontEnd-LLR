<template>

    <div class="flex flex-col gap-8 w-full h-full overflow-y-auto items-start justify-start p-2 bg-white">

        <div class="tipologia-immobile flex flex-col items-start justify-start">
            <label class="block text-lg font-semibold mb-1">Tipologia immobile</label>
            <Select v-model="selectedTipologiaImmobile" :options="opzioniTipologiaImmobile" optionLabel="name"
                placeholder="Select a City" class="w-full md:w-56" @change="setFiltroTipologiaImmobile" />
        </div>

        <div class="contratto-immobile flex flex-col items-start justify-start">
            <label class="block text-lg font-semibold mb-1">Tipologia contratto</label>
            <div class="card flex justify-center">
                <SelectButton v-model="props.filtro.tipologiaContratto" :options="opzioniContratto" />
            </div>
        </div>

        <div class="prezzo-immobile flex flex-row gap-2">
            <div class="flex flex-col items-start justify-start">
                <label class="block text-lg font-semibold mb-1">Prezzo minimo</label>
                <InputNumber v-model="props.filtro.prezzoMin" inputId="locale-german" locale="de-DE" :min="0" fluid />
            </div>
            <div class="flex flex-col items-start justify-start">
                <label class="block text-lg font-semibold mb-1">Prezzo massimo</label>
                <InputNumber v-model="props.filtro.prezzoMax" inputId="locale-german" locale="de-DE" :min="0" fluid />
            </div>
        </div>

        <div class="dimensione-immobile flex flex-row gap-2">
            <div class="flex flex-col items-start justify-start">
                <label class="block text-lg font-semibold mb-1">Metri quadri minimo</label>
                <InputNumber v-model="props.filtro.metriQuadriMin" :min="0" fluid />
            </div>
            <div class="flex flex-col items-start justify-start">
                <label class="block text-lg font-semibold mb-1">Metri quadri massimo</label>
                <InputNumber v-model="props.filtro.metriQuadriMax" :min="0" fluid />
            </div>
        </div>

        <div class="altre-caratteristiche flex flex-col items-start justify-start gap-2">
            <label class="block text-lg font-semibold mb-1">Caratteristiche Aggiuntive</label>

            <div class="card flex justify-center">
                <MultiSelect v-model="caratteristicheSelezionate" :options="caratteristiche" optionLabel="name" filter
                    placeholder="Caratteristiche aggiuntive" :maxSelectedLabels="3" class="w-full md:w-80"
                    @change="setFiltroCaratteristiche" />
            </div>

        </div>
    </div>
</template>

<script setup>
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import SelectButton from 'primevue/selectbutton';
import MultiSelect from 'primevue/multiselect';

import { ref, onMounted, watch, defineProps } from "vue";
import { useRouter, useRoute } from 'vue-router';

onMounted(() => {
    inizializzaCaratteristicheSelezionate();
});

const router = useRouter();
const route = useRoute()

const props = defineProps(['filtro']);

const opzioniContratto = ref(['AFFITTO', 'VENDITA']);

const opzioniTipologiaImmobile = ref([
    { name: 'APPARTAMENTO' },
    { name: 'TERRENO' },
    { name: 'UFFICIO' },
    { name: 'POSTOAUTO' },
    { name: 'ALTRO' }
]);

const selectedTipologiaImmobile = ref({ name: props.filtro.tipologiaImmobile });
const setFiltroTipologiaImmobile = () => {
    props.filtro.tipologiaImmobile = selectedTipologiaImmobile.value.name;
}

const caratteristicheSelezionate = ref();
const caratteristiche = ref([
    { name: 'Balconi' },
    { name: 'Garage' },
    { name: 'Posti auto' },
    { name: 'Giardino' },
    { name: 'Ascensore' },
    { name: 'Portiere' },
    { name: 'Riscaldamento centralizzato' },
    { name: 'Climatizzatori' },
    { name: 'Pannelli solari' },
    { name: 'Cantina' },
    { name: 'Soffitta' },
]);

const inizializzaCaratteristicheSelezionate = () => {

    caratteristicheSelezionate.value = [];

    if (route.query.balconi == true || route.query.balconi == 'true')
        caratteristicheSelezionate.value.push({ name: 'Balconi' });
    if (route.query.garage == true || route.query.garage == 'true')
        caratteristicheSelezionate.value.push({ name: 'Garage' });
    if (route.query.postiAuto == true || route.query.postiAuto == 'true')
        caratteristicheSelezionate.value.push({ name: 'Posti auto' });
    if (route.query.giardino == true || route.query.giardino == 'true')
        caratteristicheSelezionate.value.push({ name: 'Giardino' });
    if (route.query.ascensore == true || route.query.ascensore == 'true')
        caratteristicheSelezionate.value.push({ name: 'Ascensore' });
    if (route.query.portiere == true || route.query.portiere == 'true')
        caratteristicheSelezionate.value.push({ name: 'Portiere' });
    if (route.query.riscaldamentoCentralizzato == true || route.query.riscaldamentoCentralizzato == 'true')
        caratteristicheSelezionate.value.push({ name: 'Riscaldamento centralizzato' });
    if (route.query.climatizzatore == true || route.query.climatizzatore == 'true')
        caratteristicheSelezionate.value.push({ name: 'Climatizzatori' });
    if (route.query.pannelliSolari == true || route.query.pannelliSolari == 'true')
        caratteristicheSelezionate.value.push({ name: 'Pannelli solari' });
    if (route.query.cantina == true || route.query.cantina == 'true')
        caratteristicheSelezionate.value.push({ name: 'Cantina' });
    if (route.query.soffitta == true || route.query.soffitta == 'true')
        caratteristicheSelezionate.value.push({ name: 'Soffitta' });
}

const setFiltroCaratteristiche = () => {

    props.filtro.balconi = null;
    props.filtro.garage = null;
    props.filtro.postiAuto = null;
    props.filtro.giardino = null;
    props.filtro.ascensore = null;
    props.filtro.portiere = null;
    props.filtro.riscaldamentoCentralizzato = null;
    props.filtro.climatizzatori = null;
    props.filtro.pannelliSolari = null;
    props.filtro.cantina = null;
    props.filtro.soffitta = null;

    for (const caratteristica of caratteristicheSelezionate.value) {
        if (caratteristica.name == 'Balconi') {
            props.filtro.balconi = true;
        } else if (caratteristica.name == 'Garage') {
            props.filtro.garage = true;
        } else if (caratteristica.name == 'Posti auto') {
            props.filtro.postiAuto = true;
        } else if (caratteristica.name == 'Giardino') {
            props.filtro.giardino = true;
        } else if (caratteristica.name == 'Ascensore') {
            props.filtro.ascensore = true;
        } else if (caratteristica.name == 'Portiere') {
            props.filtro.portiere = true;
        } else if (caratteristica.name == 'Riscaldamento centralizzato') {
            props.filtro.riscaldamentoCentralizzato = true;
        } else if (caratteristica.name == 'Climatizzatori') {
            props.filtro.climatizzatori = true;
        } else if (caratteristica.name == 'Pannelli solari') {
            props.filtro.pannelliSolari = true;
        } else if (caratteristica.name == 'Cantina') {
            props.filtro.cantina = true;
        } else if (caratteristica.name == 'Soffitta') {
            props.filtro.soffitta = true;
        }
    }
}

watch(props.filtro, (newVal) => {
    selectedTipologiaImmobile.value = { name: newVal.tipologiaImmobile };

}, { deep: true });

watch(() => route.query, () => {

    caratteristicheSelezionate.value = [];

    if (route.query.balconi == true || route.query.balconi == 'true')
        caratteristicheSelezionate.value.push({ name: 'Balconi' });
    if (route.query.garage == true || route.query.garage == 'true')
        caratteristicheSelezionate.value.push({ name: 'Garage' });
    if (route.query.postiAuto == true || route.query.postiAuto == 'true')
        caratteristicheSelezionate.value.push({ name: 'Posti auto' });
    if (route.query.giardino == true || route.query.giardino == 'true')
        caratteristicheSelezionate.value.push({ name: 'Giardino' });
    if (route.query.ascensore == true || route.query.ascensore == 'true')
        caratteristicheSelezionate.value.push({ name: 'Ascensore' });
    if (route.query.portiere == true || route.query.portiere == 'true')
        caratteristicheSelezionate.value.push({ name: 'Portiere' });
    if (route.query.riscaldamentoCentralizzato == true || route.query.riscaldamentoCentralizzato == 'true')
        caratteristicheSelezionate.value.push({ name: 'Riscaldamento centralizzato' });
    if (route.query.climatizzatore == true || route.query.climatizzatore == 'true')
        caratteristicheSelezionate.value.push({ name: 'Climatizzatori' });
    if (route.query.pannelliSolari == true || route.query.pannelliSolari == 'true')
        caratteristicheSelezionate.value.push({ name: 'Pannelli solari' });
    if (route.query.cantina == true || route.query.cantina == 'true')
        caratteristicheSelezionate.value.push({ name: 'Cantina' });
    if (route.query.soffitta == true || route.query.soffitta == 'true')
        caratteristicheSelezionate.value.push({ name: 'Soffitta' });

}, { immediate: true });

</script>