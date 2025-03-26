<template>
  
      <Panel class="mb-4 w-full  lg:w-[50%] ">
        <template #header>
          <div class="w-full flex items-center h-20 bg-primary-400/50 p-2 rounded border border-surface-100 ">Agente</div>
        </template>
        <template #default>
          <div class="flex items-center gap-3">
            <Avatar :image="agente.urlFotoProfilo" size="large" />
            <div>
              <h3 class="m-0">{{  agente.username }}</h3>
              <p class="m-0 text-sm text-500">{{  agente.email }}</p>
            </div>
          </div>
        </template>
      </Panel>
</template>


<script setup>
import Panel from 'primevue/panel'
import  Avatar  from 'primevue/avatar';
import { defineProps } from 'vue';

const props = defineProps({
  agente: {
    type: Object,
    required: true,
  },
});

</script>