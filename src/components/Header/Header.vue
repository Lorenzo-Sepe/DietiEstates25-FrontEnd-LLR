<template>
  loggggg:
  {{ logged }}
  <div
    class="flex px-3 flex-row justify-between items-center w-full top-0 h-25 z-50 sticky text-black text-2xl bg-white shadow-md"
  >
    <LogoPortale v-if="isInPortale" class="pt-4" />
    <Logo v-else class="pt-4" />

    <!-- Menu di Navigazione con prop -->
    <div class="hidden lg:flex">
      <MenuNavigazione :isInPortale="isInPortale" />

      <div v-if="!logged" class="flex gap-2 items-center flex-col lg:flex-row">
        <Button label="Accedi" @click="openDialog"></Button>

        <Button label="Registrati" asChild v-slot="slotProps">
          <RouterLink to="/register" :class="slotProps.class"
            >Registrati</RouterLink
          >
        </Button>
      </div>
      <div v-else>sei loggato</div>
    </div>

    <div class="block lg:hidden">
      <Drawer v-model:visible="drawer" position="right">
        <MenuNavigazione :isInPortale="isInPortale" />
        <div
          v-if="!logged"
          class="flex gap-2 items-center flex-col lg:flex-row"
        >
          <Button label="Accedi" @click="openDialog"></Button>
          <Button label="Registrati" asChild v-slot="slotProps">
            <RouterLink to="/register" :class="slotProps.class"
              >Registrati</RouterLink
            >
          </Button>
        </div>
        <div v-else class="">sei loggato</div>
      </Drawer>
      <Button icon="pi pi-bars" @click="drawer = true" />
    </div>
    <Dialog
      v-model:visible="visible"
      :style="{ width: '50vw' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      modal
      header="Login"
    >
      <LoginDialog :dipendente="false" @close="closeDialog"></LoginDialog>
    </Dialog>
  </div>
</template>

<script setup>
import Logo from "./Logo.vue";
import LogoPortale from "./LogoPortale.vue";
import MenuNavigazione from "./MenuNavigazione.vue";
import { defineProps, ref, onMounted, onBeforeUnmount, computed } from "vue";
import Button from "primevue/button";
import Drawer from "primevue/drawer";
import Dialog from "primevue/dialog";
import LoginDialog from "../Dialogs/LoginDialog.vue";
import { RouterLink } from "vue-router";
import { useStoreUtente } from "../../stores/UserStore";
import { useEmployeeStore } from "../../stores/EmployeeStore";
const visible = ref(false);
const drawer = ref(false);
const storeUtente = useStoreUtente();
const storeEmployee = useEmployeeStore();

const logged = computed(() => {
  return false;
  if (props.isInPortale) {
    return storeEmployee.isAutenticato;
  } else {
    return storeUtente.isAutenticato;
  }
});

const props = defineProps({
  isInPortale: Boolean,
});

function openDialog() {
  visible.value = true;
}

function closeDialog() {
  visible.value = false;
}

onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth > 1024) {
      // 1024px è la soglia per lg
      drawer.value = false; // Chiude il Drawer
    }
  };

  window.addEventListener("resize", handleResize);
  handleResize(); // Controlla la dimensione iniziale

  onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize);
  });
});
</script>
