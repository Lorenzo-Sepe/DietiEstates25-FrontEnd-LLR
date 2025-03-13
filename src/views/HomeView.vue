<template>

  <div class="contenitore-menu-home">

    <div class="contenitore-immagine"></div>

    <div class="contenuto">
      <ToggleAffittoVendita />
      <SelectTipoImmobile class="ml-4" />
      <InputRicerca class="ml-4" />
      <Button class="ml-4" label="Cerca immobile" />
    </div>

  </div>

</template>

<script setup>

import ToggleAffittoVendita from '/src/components/home/ToggleVenditaAffitto.vue'
import SelectTipoImmobile from '/src/components/home/SelectTipoImmobile.vue'
import InputRicerca from '/src/components/home/InputRicerca.vue'
import Button from 'primevue/button';

</script>

<style scoped>
.contenitore-menu-home {
  position: relative;
  width: 90%;
  /* Larghezza del contenitore */
  max-width: 1200px;
  /* Limita la larghezza massima */
  height: 300px;
  margin: 0 auto;
  /* Lo centra orizzontalmente */
}

.contenitore-immagine {
  position: absolute;
  inset: 0;
  background-image: url('/src/assets/copertina_home.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.contenuto {

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* Centra sia orizzontalmente che verticalmente */
  width: 90%;
  /* Largo quasi quanto l'immagine */
  max-width: 1200px;
  /* Evita che diventi troppo grande su schermi larghi */
  height: 100px;
  /* Poco alto */
  background: rgba(255, 255, 255, 0.6);
  /* Sfondo semi-trasparente */
  backdrop-filter: blur(10px);
  /* Effetto vetro */
  border-radius: 15px;
  /* Angoli arrotondati */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  /* Ombra leggera */
}
</style>
