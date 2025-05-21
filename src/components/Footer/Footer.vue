<template>
  <div class="h-screen bg-primary-50 z-50 sticky py-2 text-black">
    <div
      class="flex pb-2 px-3 flex-col md:flex-row justify-around items-start w-full bottom-0 h-auto text-black text-2xl"
    >
      <Realizzatori />
      <Risorse />
      <PortaleBusiness />
    </div>
    <div class="flex justify-center text-2xl">
      <ToggleTheme />
    </div>
    <div class="flex justify-center text-2xl mt-2">
      <Button @click="scrollToTop" class="text-black hover:text-gray-700"
        >Torna su</Button
      >
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import Realizzatori from "./Realizzatori.vue";
import Risorse from "./Risorse.vue";
import PortaleBusiness from "./PortaleBusiness.vue";
import ToggleTheme from "./ToggleTheme.vue";
import { defineProps } from "vue";

function scrollToTop() {
  window.scrollTo(0, 0); // Scrolla in cima alla pagina
}
const props = defineProps({
  isInPortale: Boolean,
});
</script>
