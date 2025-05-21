<template>
  <Dialog
    v-model:visible="dialogNessunaModifica"
    modal
    header="AVVISO"
    :style="{ width: 'auto' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <p>
      Non hai effettuato nessuna modifica rispetto alle attuali sottoscrizioni
    </p>
    <Button label="OK" @click="dialogNessunaModifica = false" />
  </Dialog>

  <Dialog
    v-model:visible="dialogConfermaModifiche"
    modal
    :style="{ width: 'auto' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #container="{ closeCallback }">
      <div class="flex flex-col p-4">
        <h2 class="text-lg font-bold">ATTENZIONE</h2>
        <p>
          Non riceverai ulteriori notifiche relative alle categorie disattivate
          dal momento che confermi.
        </p>
        <div class="flex justify-end gap-2 my-4">
          <Button
            label="Annulla"
            severity="secondary"
            raised
            @click="closeCallback"
          />
          <Button
            label="Conferma"
            severity="success"
            raised
            @click="
              () => {
                emit('modificaSottoscrizioni');
                closeCallback();
                emit('chiudiImpostazioni');
              }
            "
          />
        </div>
      </div>
    </template>
  </Dialog>

  <div class="flex flex-col">
    <div
      v-for="(categoria, index) in props.categorie"
      class="flex justify-between items-center p-1 gap-4"
    >
      <label>{{ categoria.nomeCategoria }}</label>
      <ToggleSwitch
        v-model="checked[categoria.idCategoria]"
        @click="toggleSottoscrizione(categoria.idCategoria)"
      />
    </div>
    <div class="flex justify-end gap-2 my-4">
      <Button
        label="Annulla"
        severity="secondary"
        raised
        @click="clickAnnulla"
      />
      <Button
        label="Conferma"
        severity="success"
        raised
        @click="clickConferma"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";

import ToggleSwitch from "primevue/toggleswitch";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

const props = defineProps(["categorie"]);
const emit = defineEmits(["chiudiImpostazioni", "modificaSottoscrizioni"]);

const checked = ref({});
const sottoscrizioniIniziziali = ref([]);
const dialogNessunaModifica = ref(false);
const dialogConfermaModifiche = ref(false);

onMounted(() => {
  sottoscrizioniIniziziali.value = props.categorie.map((categoria) => ({
    ...categoria,
  }));

  props.categorie.forEach((categoria) => {
    checked.value[categoria.idCategoria] = categoria.attivo;
  });
});

const toggleSottoscrizione = (idCategoria) => {
  props.categorie.forEach((categoria) => {
    if (categoria.idCategoria === idCategoria) {
      categoria.attivo = !categoria.attivo;
    }
  });
};

const clickConferma = () => {
  if (impostazioniVariate()) {
    dialogConfermaModifiche.value = true;
  } else {
    dialogNessunaModifica.value = true;
  }
};

const clickAnnulla = () => {
  props.categorie.forEach((categoria) => {
    categoria.attivo = getValoreAttivo(categoria.idCategoria);
    checked.value[categoria.idCategoria] = categoria.attivo;
  });

  emit("chiudiImpostazioni");
};

const getValoreAttivo = (idStatoIniziale) => {
  for (const categoria of sottoscrizioniIniziziali.value) {
    if (categoria.idCategoria === idStatoIniziale) {
      return categoria.attivo;
    }
  }
};

const impostazioniVariate = () => {
  for (const categoria of props.categorie) {
    if (categoria.attivo !== getValoreAttivo(categoria.idCategoria)) {
      return true;
    }
  }

  return false;
};
</script>
