<template>
  <div class="homepage bg-white text-black flex ">
    <InputRicerca/>
    <SelectTipoImmobile/>
    <ToggleVenditaAffitto/>
  </div>
</template>

<script setup>
import InputRicerca from "../components/home/InputRicerca.vue"
import SelectTipoImmobile from "../components/home/SelectTipoImmobile.vue"
import ToggleVenditaAffitto from "../components/home/ToggleVenditaAffitto.vue"

</script>
