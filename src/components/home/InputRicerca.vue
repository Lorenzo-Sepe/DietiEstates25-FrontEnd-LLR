<template>

        <AutoComplete v-model="selectedCountry" optionLabel="comune" :suggestions="filteredCountries" placeholder="Scrivi dove cerchi l'immobile"
            @complete="search" />
</template>

<script setup>

import { ref, onMounted } from "vue";
import AutoComplete from 'primevue/autocomplete';
import { CountryService } from "/src/service/ComuniItalianiService";

onMounted(() => {
    CountryService.getCountries().then((data) => (countries.value = data));
});

const countries = ref();
const selectedCountry = ref();
const filteredCountries = ref();


const search = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            filteredCountries.value = [...countries.value];
        } else {
            filteredCountries.value = countries.value.filter((country) => {
                return country.comune.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
}

</script>
