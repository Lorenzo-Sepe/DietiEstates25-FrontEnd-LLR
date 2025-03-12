<template>
  <div class="homepage bg-white text-black ">
    <h1 >Benvenuto nella Homepage</h1>
    <Button label="test"/>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
</script>

<style scoped>
.logo-button {
  background: none;
  border: none;
  cursor: pointer;
}

.logo-button img {
  width: 100px; /* Imposta la larghezza desiderata per il logo */
  height: auto; /* Mantiene le proporzioni */
}
</style>

