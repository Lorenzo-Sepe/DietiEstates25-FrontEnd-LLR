<template>
  <AutoComplete
    :fluid="true"
    v-model="props.luogoCercato"
    optionLabel="comune"
    :suggestions="filteredCountries"
    placeholder="Scrivi dove cerchi l'immobile"
    @complete="search"
  />
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import AutoComplete from "primevue/autocomplete";
import { CountryService } from "../../services/ComuniItalianiService";

onMounted(() => {
  CountryService.getCountries().then((data) => (countries.value = data));
});

const props = defineProps(["luogoCercato"]);
const countries = ref();
const filteredCountries = ref();

const search = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredCountries.value = [...countries.value];
    } else {
      filteredCountries.value = countries.value.filter((country) => {
        return country.comune
          .toLowerCase()
          .startsWith(event.query.toLowerCase());
      });
    }
  }, 250);
};
</script>
