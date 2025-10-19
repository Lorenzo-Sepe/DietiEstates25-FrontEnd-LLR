<template>
  <AvatarAccount
    :nomeVisualizzato="nomeVisualizzato"
    :nomeAzienda="nomeAzienda"
    :avatarUrl="avatarUrl"
    @avatarClick="emit('avatarClick','impostazioniAvatar')"
    onlyAvatar
  />


</template>

<script setup>

import AvatarAccount from "./AvatarAccount.vue";
import { ref, defineProps, defineEmits } from "vue";

const emit = defineEmits(['avatarClick']);

const props = defineProps([
  "nomeVisualizzato",
  "nomeAzienda",
  "avatarUrl",
  "email",
  "isInPortale",
]);

</script>
