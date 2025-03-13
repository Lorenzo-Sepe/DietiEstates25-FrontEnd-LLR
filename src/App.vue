<script setup>
import Header from './components/Header/Header.vue';
import Footer from './components/Footer/Footer.vue';
</script>

<template>
  <Header/>
  <body class="h-screen "> 
    <router-view class="m-5"/>
  </body>
  <Footer/>
</template>

