<template>
    <div class="h-auto bg-surface-0 py-2">
      <div class="flex pb-2 px-3 flex-col md:flex-row justify-between items-center w-full  bottom-0 h-auto z-50 sticky text-black text-2xl bg-gray-200">
      <Realizzatori/>
      <Risorse/>
      <PortaleBusiness/>  
    </div>
    <div class="flex justify-center">
      <ToggleTheme/>
    </div>
    </div>
  </template>

<script setup>
import Realizzatori from './Realizzatori.vue';
import Risorse from './Risorse.vue';
import PortaleBusiness from './PortaleBusiness.vue';
import ToggleTheme from './ToggleTheme.vue';
</script>