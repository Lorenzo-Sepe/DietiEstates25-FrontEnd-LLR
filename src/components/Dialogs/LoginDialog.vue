<template>
  <Login @close="$emit('close')" class="rounded" />
  <div
    v-if="!props.dipendente"
    class="mt-2 flex flex-col justify-center rounded bg-gray-100 items-center"
  >
    <Auth0Login @close="$emit('close')" />
  </div>
</template>

<script setup>
import Login from "../Logins/Login.vue";
import { defineEmits } from "vue";
import Auth0Login from "../Logins/Auth0Login.vue";

const emit = defineEmits(["close"]);

const props = defineProps({
  dipendente: Boolean,
  required: true,
});
</script>
