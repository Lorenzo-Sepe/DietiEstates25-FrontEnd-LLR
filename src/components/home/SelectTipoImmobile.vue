<template>

    <Select class="w-1/3" v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Seleziona il tipo di immobile" />

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