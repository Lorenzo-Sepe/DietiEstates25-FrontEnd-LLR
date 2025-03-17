<template>

  <div class="home_image-container">

    <img src="/src/assets/copertina_home.png" alt="home" class="home_image" />

    <div class="home_ricerca">

      <div class="flex flex-row gap-[1rem] fluid">
        <ToggleVenditaAffitto />
        <SelectTipoImmobile />
        <InputRicerca />
        <Button label="Cerca" icon="pi pi-search" />
      </div>

      <a href="http://www.poivedremo.it" class="text-lg font-semibold text-blue-600 hover:text-blue-800 underline decoration-2 transition duration-200 ease-in-out">
        Oppure clicca qui per disegnare la tua zona di interesse
      </a>

    </div>

  </div>

</template>

<script setup>
import InputRicerca from "../components/Homepage/InputRicerca.vue"
import SelectTipoImmobile from "../components/Homepage/SelectTipoImmobile.vue"
import ToggleVenditaAffitto from "../components/Homepage/ToggleVenditaAffitto.vue"
import Button from "primevue/button"
</script>

<style scoped>
.home_image-container {

  position: relative;
  width: 80%;
  margin: 2rem;

}

.home_image-container .home_image {

  display: block;
  width: 100%;
  height: auto;

}

.home_ricerca {

  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

}

</style>
