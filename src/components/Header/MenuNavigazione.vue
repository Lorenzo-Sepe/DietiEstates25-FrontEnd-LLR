<template>
    <nav class="p-2 lg:mr-5 flex gap-2 lg:gap-4 flex-col lg:flex-row items-center ">
      <router-link 
        v-for="voce in menuCorrente" 
        :key="voce.nome"
        :to="voce.percorso"
        class="text-black hover:text-gray-600 transition-all duration-200 text-lg flex"
      >
        {{ voce.nome }}
      </router-link>
    </nav>
  </template>
  
  <script setup>
  import { computed, defineProps } from 'vue';
  
  const props = defineProps({
    isInPortale: Boolean
  });
  
  // Definizione dei menu per le diverse aree
  const menuGenerale = [
    { nome: "Cerca Annunci", percorso: "/cerca-annunci" },
    { nome: "Storico ricerche", percorso: "/storico-ricerche" },
    { nome: "Le mie notifiche", percorso: "/notifiche" }
  ];
  
  const menuVenditore = [
    { nome: "Gestisci i tuoi annunci immobiliari", percorso: "/gestisci-annunci" },
    { nome: "Messaggi promozionali", percorso: "/messaggi-promozionali" },
    { nome: "Team", percorso: "/team" }
  ];
  
  // Menu dinamico in base alla prop ricevuta dal padre
  const menuCorrente = computed(() => (props.isInPortale ? menuVenditore : menuGenerale));
  </script>
  