<script setup>
import Header from './components/Header/Header.vue';
import Footer from './components/Footer/Footer.vue';
</script>

<template>
  <Header/>
  <body class="h-screen flex justify-center items-center"> 
    <router-view/>
  </body>
  <Footer/>
</template>

