<template>
    <AvatarAccount
      :nomeVisualizzato="nomeVisualizzato"
      :nomeAzienda="nomeAzienda"
      :avatarUrl="avatarUrl"
      @Avatarclick="avatarClicked"
        onlyAvatar
      ></AvatarAccount>
</template>

<script setup>
import AvatarAccount from "./AvatarAccount.vue";
import { defineProps } from "vue";

const props = defineProps([
  "nomeVisualizzato",
  "nomeAzienda",
  "avatarUrl"
]);

const avatarClicked = () => {
  // Logica per gestire il click sull'avatar
  alert("Avatar clicked  TODO far comparire un pop per il logount ed altre opzioni");
};
</script>