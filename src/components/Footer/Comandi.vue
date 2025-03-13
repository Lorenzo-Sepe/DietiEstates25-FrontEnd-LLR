<template>
    <div class="bg-surface-0">
     <h4 class="font-bold">Agenzie Immobiliari</h4>
     <div class="text-sm">
         
     
     <div>
         <ul>
            <Toggle/>
         </ul>
     </div>
    
     </div>
    </div>
 </template>
 
 <script setup>
 import Toggle from './ToggleTheme.vue'
 import { ref } from 'vue';

 const lightMode = ref(false);

 // Aggiungi qui la logica per gestire il cambiamento della modalità
 </script>