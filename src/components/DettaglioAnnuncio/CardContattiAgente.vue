<template>
  <div class="w-full lg:w-fit p-1 lg:p-8">
    <div
      class="card-contatti lg:w-90 h-60 shadow-[0_0_0_4px_rgba(0,0,0,0.05)] rounded-md bg-gray-100 lg:p-4 flex flex-col gap-2 items-start justify-start"
    >
      <div class="intestazione w-full border-b hidden lg:block">
        <span class="text-xl font-bold">Contatti agente immobiliare</span>
      </div>

      <div
        class="info-agente flex flex-row p-2 items-start justify-start gap-2"
      >
        <div class="immagine-agente w-16 h-16 rounded-full bg-gray-200">
          <img
            :src="props.agente.urlFotoProfilo"
            size="xlarge"
            alt="Immagine agente"
            class="w-full h-full rounded-full"
          />
        </div>

        <div class="flex flex-col ml-2">
          <span class="text-xl font-medium">{{ props.agente.nome }}  {{ props.agente.cognome }}</span>
          <span class="text-base font-normal">Nome agenzia</span>
        </div>
      </div>

      <div class="contatti-agente flex flex-col gap-4">
        <span class="text-base font-semibold inline-flex">
          <img
            src="../../assets/Icon/cornettaTelefono.png"
            class="w-6 h-6 mr-2"
            alt="Telefono"
          />
          3206984615
        </span>
        <span class="text-base font-semibold inline-flex">
          <img
            src="../../assets/Icon/email.png"
            class="w-6 h-6 mr-2"
            alt="Email"
          />
          rbrna98@gmail.com
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>

import {ref, onMounted, defineProps} from "vue";

onMounted(() => {
});

const props = defineProps(["agente"]);

</script>
