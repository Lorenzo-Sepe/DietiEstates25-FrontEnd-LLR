<template>
  <div class="contenitore-card">
    <div class="header-flex">
      <input type="file" multiple accept="image/*" @change="onSelectedFiles" hidden ref="inputFile" />
      <Button @click="apriSelettore" icon="pi pi-image" label="Aggiungi immagini" outlined class="p-button-sm" />
      <Button @click="pulisciTutto" icon="pi pi-trash" label="Pulisci tutto" severity="danger" outlined class="p-button-sm" :disabled="!annuncio.immobile.immagini.length" />
    </div>

    <div v-if="annuncio.immobile.immagini.length" class="contenitore-immagini">
      <div v-for="(img, index) in annuncio.immobile.immagini" :key="index" class="card-immagine">
        <div class="contenitore-immagine">
          <img :src="img.urlImmagineEsistente" class="anteprima-immagine" />
          <Button icon="pi pi-times" severity="danger" class="bottone-elimina" @click="rimuoviFile(index)" rounded text />
        </div>
        <div class="descrizione-file">
          <InputText v-model="img.descrizione" placeholder="Inserisci una breve descrizione della foto" class="input-descrizione" />
        </div>
      </div>
    </div>

    <div v-else class="contenitore-vuoto">
      <i class="pi pi-image icona-vuota" />
      <p class="testo-vuoto">Clicca o trascina immagini qui</p>
    </div>
  </div>
</template>

<script setup>
import { ref , defineProps} from 'vue';
import { Button, InputText } from 'primevue';
import { AnnuncioImmobiliareRequest ,Immagine} from '../../dto/RequestAnnuncio';


const props = defineProps({ 
  annuncio: AnnuncioImmobiliareRequest,
  tentativoInvio: Boolean
});

const inputFile = ref(null);

const apriSelettore = () => {
  inputFile.value.click();
};

const onSelectedFiles = (event) => {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const immagine = new Immagine();
      immagine.file = file
      immagine.urlImmagineEsistente=e.target.result;
      immagine.descrizione = ``;

      props.annuncio.immobile.immagini.push(immagine);
      console.log('Immagini:', props.annuncio.immobile.immagini);
      
    };
    reader.readAsDataURL(file);
  });
  event.target.value = '';
};

const rimuoviFile = (index) => {
  props.annuncio.immobile.immagini.splice(index, 1);
};

const pulisciTutto = () => {
  props.annuncio.immobile.immagini = [];
};

const formatSize = (bytes) => {
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
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
