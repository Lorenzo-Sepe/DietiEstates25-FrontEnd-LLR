<script setup>
import Header from './components/Header/Header.vue';
import Footer from './components/Footer/Footer.vue';
import { useRoute } from 'vue-router';
import{ computed } from 'vue';
const route = useRoute();

// Determina se l'utente è nell'area venditore
const isInPortale = computed(() => route.path.startsWith('/venditore'));

</script>

<template>
  <Header :isInPortale="isInPortale" />
  <body class="h-screen flex justify-center items-center"> 
    <router-view/>
  </body>
  <Footer  :isInPortale="isInPortale" />
</template>

