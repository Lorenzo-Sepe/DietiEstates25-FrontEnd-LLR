<template>
    <FileUpload mode="advanced" name="file" @select="caricaImmagini" accept="image/*" multiple />
    <div class="flex pt-6 justify-between">
      <Button label="Indietro" severity="secondary" icon="pi pi-arrow-left" @click="$emit('indietro')" />
      <Button label="Invia Annuncio" icon="pi pi-check" @click="$emit('invia')" class="p-mt-2" />
    </div>
  </template>
  
  <script setup>
  import { defineEmits, ref, defineProps } from 'vue';
  import FileUpload from 'primevue/fileupload';
  import Button from 'primevue/button';
  import { Immagine } from '../../dto/RequestAnnuncio';
  
  const props = defineProps({ annuncio: Object });
  const emit = defineEmits(['indietro', 'invia']);
  const immagini = ref([]);
  
  const caricaImmagini = (event) => {
    const files = event.files;
    files.forEach((file, index) => {
      console.log('File caricato:', index);
      const immagine = new Immagine();
      immagine.file = file;
      immagine.descrizione = `Immagine ${index + 1}`;
      
      // Accedi a annuncio tramite props
      props.annuncio.immobile.immagini.push(immagine);
      console.log('Immagini:', props.annuncio.immobile.immagini);
    });
  };
  </script>
  
  <style scoped>
  .p-fluid {
      display: flex;
      flex-direction: column;
      gap: 10px;
  }
  </style>