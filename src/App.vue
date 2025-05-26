<script setup>
import Header from "./components/Header/Header.vue";
import Footer from "./components/Footer/Footer.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { isPortaleAgenziaAreaPage } from "./services/StatoPaginaService";

const route = useRoute();

// Determina se l'utente è nell'area venditore
const isInPortale = computed(() => isPortaleAgenziaAreaPage(route));

</script>

<template>
  <Header :isInPortale="isInPortale" />
  <body class="h-screen flex justify-center items-center">
    <router-view />
  </body>
  <Footer :isInPortale="isInPortale" class="z-100" />
</template>
