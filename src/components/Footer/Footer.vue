<template>
    <div class="h-auto bg-surface-200/95 py-2 text-black">
      <div class="flex pb-2 px-3 flex-col md:flex-row justify-between items-center w-full  bottom-0 h-auto z-50 sticky text-black text-2xl ">
      <Realizzatori/>
      <Risorse/>
      <PortaleBusiness/>  
    </div>
    <div class="flex justify-center  text-2xl">
      <ToggleTheme/>
    </div>
    </div>
  </template>

<script setup>
import Realizzatori from './Realizzatori.vue';
import Risorse from './Risorse.vue';
import PortaleBusiness from './PortaleBusiness.vue';
import ToggleTheme from './ToggleTheme.vue';
import { defineProps } from 'vue';

const props = defineProps({
    isInPortale: Boolean
  });

</script>