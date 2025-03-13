<template>
    <div class="flex bg-surface-0 px-3 flex-row justify-between items-start w-full  bottom-0 h-auto z-50 sticky text-black text-2xl">
      <Realizzatori/>
      <Risorse/>
      <Comandi/>
    </div>
  </template>

<script setup>
import Realizzatori from './Realizzatori.vue';
import Risorse from './Risorse.vue';
import Comandi from './Comandi.vue';
</script>