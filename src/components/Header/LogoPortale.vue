<template>
  <div class="mx-4 flex flex-col items-center justify-center cursor-pointer" @click="router.push('/PortaleAgenzia')">
    <img
      src="/src/assets/Icon/icona.svg"
      alt="Logo del Sito"
      width="64"
      height="64"
      class="greyscale"
    />
    <p>Portale Dipendenti</p>
  </div>
</template>

<style scoped>
.greyscale {
  filter: grayscale(100%);
}
</style>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>
