<!-- Start Generation Here -->
<template>
  <div class="flex flex-col align-items-center justify-content-center my-5">
    <img src="../../assets/Icon/icona.svg" alt="Logo" class="logo h-50" />
    <p>La registrazione è avvenuta con successo.</p>
    <p>Proseguire con il login</p>
    <Button label="Torna alla Homepage" @click="goHome" />
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
});

const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>
<!-- End Generation Here -->
