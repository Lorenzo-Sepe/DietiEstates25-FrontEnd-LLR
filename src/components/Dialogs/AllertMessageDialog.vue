<template>
  <div>
    <p>{{ message }}</p>
    <div class="flex flex-row gap-2">
      <Button
        :label="isRegister ? 'Registrati' : 'Chiudi'"
        @click="isRegister ? goToRegister : closeDialog"
      />
      <Button
        v-if="isLogin"
        label="Accedi"
        @click="goToLogin"
        class="p-button-secondary"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";

const emit = defineEmits(["close", "goToLogin"]);

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  isRegister: {
    type: Boolean,
    default: false,
  },
  isLogin: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();

const closeDialog = () => {
  emit("close");
  router.push("/");
};

const goToRegister = () => {
  router.push("/register");
};

const goToLogin = () => {
  emit("goToLogin");
};
</script>
