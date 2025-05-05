<template>
  <div class="flex flex-col">
    <div class="flex flex-column gap-2 w-full ring-1 ring-gray-300 rounded-md p-4">
    <Markdown class="w-full" v-model="test" label="Contenuto" required></Markdown>
  </div>

  <div v-html="test"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
  import Markdown from '../components/MarkdownEditor.vue';
  
  const test = ref('testo');

  const newIdea = ref({
    title: '',
    content: '',
});

</script>