<script setup>
import Header from './components/Header/Header.vue';
import Footer from './components/Footer/Footer.vue';
</script>

<template>
  <Header/>
  <body class="h-screen bg-surface-200"> 
    <router-view class="m-5"/>
  </body>
  <Footer/>
</template>

