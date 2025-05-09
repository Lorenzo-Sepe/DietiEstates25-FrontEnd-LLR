<template>
  <Dialog
    v-model:visible="impostazioniSottoscrizineVisibe"
    modal
    :style="{ width: 'auto' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #container="{ closeCallback }">
      <div class="flex flex-col p-4">
        <h2 class="text-lg font-bold">DISATTIVA/ATTIVA NOTIFICHE</h2>
        <ImpostazioniSottoscrizioni
          :categorie="props.categorie"
          @chiudiImpostazioni="closeCallback"
          @modificaSottoscrizioni="emit('modificaSottoscrizioni')"
        />
      </div>
    </template>
  </Dialog>

  <Select
    v-model="selectedCategoria"
    :options="nomiCategorie"
    optionLabel="name"
    placeholder="Tutte le categorie"
    @change="clickCategoria"
  />

  <Button
    variant="text"
    rounded
    aria-label="Filter"
    @click="impostazioniSottoscrizineVisibe = true"
    v-tooltip="{
      value: 'Impostazioni sottoscrizioni',
      showDelay: 300,
      hideDelay: 300,
    }"
  >
    <template #icon>
      <img src="../../assets/Icon/menuSottoscrizione.png" class="w-5 h-5" />
    </template>
  </Button>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import ImpostazioniSottoscrizioni from "../Notifiche/ImpostazioniSottoscrizioni.vue";

import Select from "primevue/select";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

const router = useRouter();
const route = useRoute();

const props = defineProps(["categorie"]);
const emit = defineEmits(["modificaSottoscrizioni"]);

const impostazioniSottoscrizineVisibe = ref(false);

const selectedCategoria = ref();
const nomiCategorie = ref([{}]);

const clickCategoria = () => {
  router.push({
    path: route.path,
    query: {
      ...route.query,
      nome: selectedCategoria.value.name,
      id: selectedCategoria.value.id,
      pagina: 0,
    },
  });
};

const updateCategorie = () => {
  console.log("updateCategorie", props.categorie);

  props.categorie.forEach((categoria) => {
    nomiCategorie.value.push({
      name: categoria.nomeCategoria,
      id: categoria.idCategoria,
    });
  });
};

watch(() => props.categorie, updateCategorie, { immediate: true });
</script>
