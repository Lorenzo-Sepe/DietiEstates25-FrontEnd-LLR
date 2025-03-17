<template>

  <div class="home_image-container">

    <img src="/src/assets/copertina_home.png" alt="home" class="home_image" />

    <div class="home_ricerca">

      <div class="flex flex-row gap-[1rem]">
        <ToggleVenditaAffitto />
        <SelectTipoImmobile />
        <InputRicerca />
        <Button class="w-1/4" label="Cerca" icon="pi pi-search" />
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
  width: 90%;
  margin: 2rem;

}

.home_image-container .home_image {

  display: block;
  width: 100%;
  height: auto;

}

@media (max-width: 768px) {
  .home_image-container {
    width: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .home_image-container .home_image {
    position: static; 
    width: 80%;
  }

  .home_ricerca {
    position: static;
    transform: none;
    width: 90%;
    margin-top: 1rem;
  }
}

.home_ricerca {

  width: 90%;
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

@media (max-width: 768px) {
  .home_ricerca {
    width: 100%;
    padding: 2rem;
    height: auto;
    position: static;
    transform: none;
    background-color: #E5E7EB;
  }

  .home_ricerca .flex {
    flex-direction: column;
    align-items: stretch;
  }
}

</style>
