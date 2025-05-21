<template>
  <div class="card">
    <Paginator
      :rows="5"
      :totalRecords="props.propNumeroAnnunci"
      @page="onPage"
    ></Paginator>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from "vue";
import Paginator from "primevue/paginator";

const emit = defineEmits(["onPage"]);
const props = defineProps(["propFiltro", "propNumeroAnnunci"]);

onMounted(async () => {});

const onPage = (event) => {
  console.log("pagina cliccata: ", event.page);
  props.propFiltro.numeroPagina = event.page + 1;
  emit("onPage");
};
</script>
