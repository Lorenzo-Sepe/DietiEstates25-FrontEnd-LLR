<template>
  <div class="card flex flex-col gap-6 items-center justify-center">
    <input
      type="file"
      multiple
      accept="image/*"
      @change="onSelectedFiles"
      hidden
      ref="inputFile"
    />
    <Button
      @click="apriSelettore"
      icon="pi pi-image"
      label="Scegli Immagine"
      outlined
      class="pulsante"
    />
  </div>
</template>

<script setup>
import { ref, defineEmits, reactive } from "vue";

import Button from "primevue/button";

const inputFile = ref(null);

const errori = reactive({
  immagineiVuote: {
    invalid: false,
    messaggio: "Devi caricare almeno un'immagine",
  },
  dimensioneTotale: {
    invalid: false,
    messaggio: "Le immagini caricate superano i 50 MB totali",
  },
  descrizioneLunga: {
    invalid: false,
    messaggio: "Ogni descrizione deve essere di massimo 20 caratteri",
  },
  descrizione: [], // Inizializza come array vuoto
});

const emit = defineEmits(["image-uploaded"]);

const apriSelettore = () => {
  inputFile.value.click();
};

const onSelectedFiles = (event) => {
  
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      errori.descrizione.push({ invalid: false, messaggio: "" });
      const urlImage = e.target.result;
      emit("image-uploaded", urlImage);
    };
    reader.readAsDataURL(file);
  });
  event.target.value = "";
  //emit('image-uploaded', urlImage); // Emetti l'evento con l'array di immagini
};

// Funzione per creare un oggetto File da un URL base64
function creaFileDaUrl(base64, nomeFile) {
  return new Promise((resolve, reject) => {
    try {
      // Estrazione della parte MIME e dei dati base64
      const [header, base64Data] = base64.split(",");

      // Estrazione del tipo MIME dall'header
      const tipo = header.split(":")[1].split(";")[0];

      // Converte la parte base64 in un array di byte
      const byteArray = new Uint8Array(
        atob(base64Data)
          .split("")
          .map((char) => char.charCodeAt(0)),
      );

      // Crea un oggetto Blob con il tipo MIME estratto
      const blob = new Blob([byteArray], { type: tipo });

      // Crea un oggetto File dal Blob
      const file = new File([blob], nomeFile, { type: tipo });

      // Risolve la Promise con il file creato
      resolve(file);
    } catch (error) {
      // Rifiuta la Promise in caso di errore
      reject(error);
    }
  });
}
</script>
