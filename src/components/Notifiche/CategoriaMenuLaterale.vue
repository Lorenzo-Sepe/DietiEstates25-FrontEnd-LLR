<template>
  <Dialog
    v-model:visible="dialogConferma"
    modal
    header="ATTENZIONE"
    :style="{ width: 'auto' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <p>Non riceverai ulteriori notifiche relative a questa categoria</p>
    <div class="flex justify-end gap-2 my-4">
      <Button
        label="Annulla"
        severity="secondary"
        raised
        @click="dialogConferma = false"
      />
      <Button
        label="Conferma"
        severity="success"
        raised
        @click="clickConferma"
      />
    </div>
  </Dialog>

  <div
    class="flex justify-between items-center p-1 gap-4 w-full hover:bg-[#ECFDF5]/60! cursor-pointer"
  >
    <div
      class="flex-1 flex flex-col"
      @click="
        clickCategoria(
          props.categoria.nomeCategoria,
          props.categoria.idCategoria,
        )
      "
    >
      <span class="font-medium">{{ props.categoria.nomeCategoria }}</span>
      <span class="text-sm text-surface-500">{{
        props.categoria.descrizioneCategoria
      }}</span>
    </div>
    <Button
      class="w-18 h-10 text-xs sm:text-sm"
      v-if="props.categoria.attivo"
      label="Disattiva"
      @click="clickDisattiva(props.categoria)"
    />
    <Button
      class="w-18 h-10 text-xs sm:text-sm"
      v-else
      label="Attiva"
      @click="clickAttiva(props.categoria)"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { useRouter, useRoute } from "vue-router";

import { Button } from "primevue";
import Dialog from "primevue/dialog";

const props = defineProps(["categoria"]);
const emit = defineEmits(["modificaSottoscrizione"]);

const router = useRouter();
const route = useRoute();

const dialogConferma = ref(false);
const idCategoriaSelected = ref(null);

const clickCategoria = (nomeCategoria, idCategoria) => {
  router.push({
    path: route.path,
    query: { ...route.query, nome: nomeCategoria, id: idCategoria, pagina: 0 },
  });
};

const clickDisattiva = (categoria) => {
  idCategoriaSelected.value = categoria.idCategoria;
  dialogConferma.value = true;
};

const clickAttiva = (categoria) => {
  idCategoriaSelected.value = categoria.idCategoria;
  emit("modificaSottoscrizione", idCategoriaSelected.value);
};

const clickConferma = () => {
  dialogConferma.value = false;

  emit("modificaSottoscrizione", idCategoriaSelected.value);
};
</script>
