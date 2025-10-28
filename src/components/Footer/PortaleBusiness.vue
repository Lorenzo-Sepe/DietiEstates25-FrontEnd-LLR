<template>
  <div>
    <h4 class="font-bold">
      {{ props.isInPortale ? 'Area Agenzie' : 'Agenzia Immobiliare' }}
    </h4>

    <!-- Se siamo nel sito clienti -->
    <template v-if="!props.isInPortale">
      <ul>
        <li>
          <Button
            icon="pi pi-sign-in"
            label="Accedi al Portale Agenzie"
            class="mb-2"
            style="width: 100%"
            @click="navigateToPortale"
          />
        </li>
        <li>
          <Button
            icon="pi pi-building"
            label="Registra la tua Agenzia Immobiliare"
            style="width: 100%"
            class="mb-2"
            severity="secondary"
            @click="handleRegistraAgenzia"
          />
        </li>
      </ul>
    </template>

    <!-- Se siamo nel portale agenzie -->
    <template v-else>
      <ul>
        <li>
          <Button
            icon="pi pi-home"
            label="Visita il sito clienti"
            class="mb-2"
            style="width: 100%"
            @click="goToHomeClienti"
          />
        </li>
        <li>
          <Button
            icon="pi pi-user-plus"
            label="Registrati per cercare immobili"
            class="mb-2"
            style="width: 100%"
            severity="secondary"
            @click="goToRegisterCliente"
          />
        </li>
      </ul>
    </template>

    <!-- Dialog di allerta -->
    <Dialog
      v-model:visible="visibleAllert"
      :style="{ width: '40vw' }"
      :breakpoints="{ '1199px': '70vw', '575px': '90vw' }"
      modal
      header="Attenzione"
    >
      <AllertDialog
        :message="'Token non valido'"
        :isRegister="false"
        :isLogin="true"
        @close="closeDialog"
        @goToLogin="goToLogin"
      />
    </Dialog>

    <!-- Dialog di login -->
    <Dialog
      v-model:visible="visibleLogin"
      :style="{ width: '40vw' }"
      :breakpoints="{ '1199px': '70vw', '575px': '90vw' }"
      modal
      header="Login"
    >
      <LoginDialog @close="closeDialog" :dipendente="true" />
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import AllertDialog from "../Dialogs/AllertMessageDialog.vue";
import LoginDialog from "../Dialogs/LoginDialog.vue";
import { useRouter } from "vue-router";
import { useEmployeeStore } from "../../stores/EmployeeStore";
import { isTokenValid } from "../../services/UserService";

const props = defineProps({
  isInPortale: Boolean,
});

const router = useRouter();
const employeeStore = useEmployeeStore();
const visibleAllert = ref(false);
const visibleLogin = ref(false);

function closeDialog() {
  visibleAllert.value = false;
  visibleLogin.value = false;
}

async function navigateToPortale() {
    router.push({ name: "PortaleAgenzia" });
  
}

function goToLogin() {
  visibleAllert.value = false;
  visibleLogin.value = true;
}

function handleRegistraAgenzia() {
  router.push({ name: "registerAgency" });
}

function goToHomeClienti() {
  router.push("/");
}

function goToRegisterCliente() {
  router.push({ name: "register" });
}
</script>
