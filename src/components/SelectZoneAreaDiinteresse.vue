<template>
  <Select
    class="w-full"
    v-model="cittaSelezionata"
    :options="listaCitta"
    filter
    filterPlaceholder="Digita per cercare"
    placeholder="Seleziona una città"
    
    />
</template>

<script setup>
import { ref, defineModel, onMounted } from "vue";
import Select from "primevue/select";
import { CountryService } from "../services/ComuniItalianiService";

// 🔹 v-model legato solo alla stringa del nome città
const cittaSelezionata = defineModel("comune");

// 🔹 Lista di città (solo denominazioni, senza duplicati)
const listaCitta = ref([]);

onMounted(() => {
  const comuni = CountryService.getData();

  // usiamo un Set per evitare duplicati
  listaCitta.value = [...new Set(comuni.map((c) => c.comune))];
    listaCitta.value.unshift("Italia");
});
</script>
