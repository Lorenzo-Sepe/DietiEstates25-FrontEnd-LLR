<template>
  <Select
    v-model="props.tipoImmobileSelezionato"
    :fluid="false"
    :options="opzioniTipoImmobili"
    optionLabel="name"
    placeholder="Seleziona il tipo di immobile"
  />
</template>

<script setup>
import { ref, defineProps } from "vue";
import Select from "primevue/select";

const props = defineProps(["tipoImmobileSelezionato"]);

const opzioniTipoImmobili = ref([
  { name: "APPARTAMENTO" },
  { name: "TERRENO" },
  { name: "POSTOAUTO" },
  { name: "UFFICIO" },
  { name: "ALTRO" },
]);
</script>
