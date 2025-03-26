<template>
  <div class="contenitore-card">
    <FileUpload
      name="demo[]"
      :multiple="true"
      accept="image/*"
      :maxFileSize="100000000"
      @select="onSelectedFiles"
    >
      <template #header="{ chooseCallback, clearCallback, files }">
        <div class="header-flex">
          <Button
            @click="chooseCallback()"
            icon="pi pi-image"
            label="Aggiungi immagini"
            outlined
            class="p-button-sm"
          />
          <Button
            @click="clearCallback()"
            icon="pi pi-trash"
            label="Pulisci tutto"
            severity="danger"
            outlined
            class="p-button-sm"
            :disabled="!files?.length"
          />
        </div>
      </template>

      <template #content="{ files, removeFileCallback }">
        <div class="contenitore-immagini">
          <div
            v-for="(file, index) in files"
            :key="file.name"
            class="card-immagine"
          >
            <div class="contenitore-immagine">
              <img
                :src="file.objectURL"
                :alt="file.name"
                class="anteprima-immagine"
              />
              <Button
                icon="pi pi-times"
                severity="danger"
                class="bottone-elimina"
                @click="removeFileCallback(index)"
                rounded
                text
              />
            </div>
            <div class="descrizione-file">
              <InputText
                v-model="file.description"
                placeholder="Inserisci una breve descrizione della foto"
                class="input-descrizione"
              />
              <div class="dettagli-file">
                <span class="nome-file">{{ file.name }}</span>
                <span class="dimensione-file">{{ formatSize(file.size) }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #empty>
        <div class="contenitore-vuoto">
          <i class="pi pi-image icona-vuota" />
          <p class="testo-vuoto">Clicca o trascina immagini qui</p>
        </div>
      </template>
    </FileUpload>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';
import FileUpload from 'primevue/fileupload';
import { Button,InputText } from 'primevue';


const $primevue = usePrimeVue();
const files = ref([]);

const onSelectedFiles = (event) => {
  files.value = event.files.map((file) => ({
    ...file,
    description: '',
  }));
};

const formatSize = (bytes) => {
  const k = 1024;
  const sizes = $primevue.config.locale.fileSizeTypes;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
</script>

<style scoped>
.contenitore-card {
  max-width: 800px;
  margin: auto;
}

.header-flex {
  display: flex;
  gap: 10px;
  align-items: center;
}

.contenitore-immagini {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.card-immagine {
  width: 240px;
  background: white;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.contenitore-immagine {
  position: relative;
}

.anteprima-immagine {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
}

.bottone-elimina {
  position: absolute !important;
  top: 8px;
  right: 8px;
  background: rgba(255, 0, 0, 0.7);
  color: white;
}

.descrizione-file {
  padding-top: 10px;
}

.input-descrizione {
  width: 100%;
  padding: 5px;
  border: none;
  text-align: center;
  background: #f8f8f8;
}

.dettagli-file {
  font-size: 12px;
  color: #666;
}

.nome-file {
  display: block;
  font-weight: bold;
}

.dimensione-file {
  display: block;
}

.contenitore-vuoto {
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  background: #f4f4f4;
}

.icona-vuota {
  font-size: 3rem;
  color: #bbb;
}

.testo-vuoto {
  color: #777;
  font-size: 14px;
}
</style>
