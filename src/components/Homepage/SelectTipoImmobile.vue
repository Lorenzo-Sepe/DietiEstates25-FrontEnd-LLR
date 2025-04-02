<template>

    <Select v-model="selectedCity" 
    :fluid="false"
    :options="cities" 
    optionLabel="name" 
    placeholder="Seleziona il tipo di immobile" 
    />

</template>

<script setup>

import { ref } from 'vue';
import Select from 'primevue/select';


const selectedCity = ref();
const cities = ref([
   { name: 'Appartamenti' },
   { name: 'Uffici'},
   { name: 'Garage'}
]);

</script>