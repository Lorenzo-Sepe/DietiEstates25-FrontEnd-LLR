<template>
  <nav
    class="pb-2 lg:pb-0 lg:mr-5 flex gap-2 lg:gap-4 flex-col lg:flex-row items-start justify-start lg:items-center lg:justify-between"
  >
    <router-link
      v-for="voce in menuCorrente"
      :key="voce.nome"
      :to="voce.percorso"
      class="text-black hover:text-gray-600 transition-all duration-200 text-lg"
    >
      {{ voce.nome }}
    </router-link>
  </nav>
</template>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  isInPortale: Boolean,
});

// Definizione dei menu per le diverse aree
const menuGenerale = [
  { nome: "Storico ricerche", percorso: "/storico-ricerche" },
  { nome: "Le mie notifiche", percorso: "/notifiche" },
];

const menuVenditore = [
  {
    nome: "Gestisci i tuoi annunci immobiliari",
    percorso: "/PortaleAgenzia/miei-annunci",
  },
  {
    nome: "Messaggi promozionali",
    percorso: "/PortaleAgenzia/messaggi-promozionali",
  },
  { nome: "Team", percorso: "/PortaleAgenzia/team" },
];

// Menu dinamico in base alla prop ricevuta dal padre
const menuCorrente = computed(() =>
  props.isInPortale ? menuVenditore : menuGenerale,
);
</script>
