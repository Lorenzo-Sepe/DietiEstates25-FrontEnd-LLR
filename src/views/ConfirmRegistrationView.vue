<template>
  <ConfirmRegistration />
</template>

<script setup>
import { useRoute } from "vue-router";
import ConfirmRegistration from "../components/Logins/ConfirmRegistration.vue";

const route = useRoute();
const routeParams = {
  message: route.params.message || "Registrazione completata!",
  isPasswordVisible: route.params.isPasswordVisible || false,
};
</script>
