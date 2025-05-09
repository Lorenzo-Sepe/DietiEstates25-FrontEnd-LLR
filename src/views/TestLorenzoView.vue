<template>
  <div class="block gap-2 rounded-md p-4">
    <div >
      <Markdown class="w-max" v-model="test" label="Contenuto" required></Markdown>
    </div>

    <!-- Mostra l'HTML sanificato -->
    
   
    <Button></Button>
  </div>
</template>

<script setup>
import  Button  from 'primevue/button';
import { ref } from 'vue';
import Markdown from '../components/MarkdownEditor.vue';
import HtmlService from '../services/HtmlService.js';

const test = ref('test');
</script>
