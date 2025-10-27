<template>
  <nav
    class="flex flex-col lg:flex-row items-start lg:items-start justify-start lg:justify-between gap-2 lg:gap-4 pb-2 lg:pb-0 lg:mr-5"
  >
    <router-link
      v-for="item in menuCorrente"
      :key="item.nome"
      :to="item.percorso"
      class="menu-item"
    >
      {{ item.nome }}
    </router-link>

    <Button
      v-if="!isInPortale"
      label="Storico ricerche"
      variant="text"
      class="menu-item"
      @click="emit('chiudiDrawer', 'storicoRicerche')"
    />
  </nav>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";
import Button from "primevue/button";

const props = defineProps({ isInPortale: Boolean });
const emit = defineEmits(["chiudiDrawer"]);

const menuGenerale = [{ nome: "Le mie notifiche", percorso: "/notifiche" }];
const menuVenditore = [
  { nome: "Gestisci annunci immobiliari", percorso: "/PortaleAgenzia/miei-annunci" },
  { nome: "Messaggi promozionali", percorso: "/PortaleAgenzia/messaggi-promozionali" },
];

const menuCorrente = computed(() =>
  props.isInPortale ? menuVenditore : menuGenerale
);
</script>

<style scoped>
.menu-item {
  all: unset;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  height: 48px; /* stessa altezza avatar */
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: color 0.2s, background-color 0.2s;
}

.menu-item:hover {
  color: #4b5563;
  background-color: rgba(0, 0, 0, 0.03);
}

/* Forza lo stesso stile anche dentro il bottone PrimeVue */
:deep(.p-button.menu-item) {
  all: unset;
  display: inline-block;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: color 0.2s, background-color 0.2s;
}

:deep(.p-button.menu-item:hover) {
  color: #4b5563;
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
