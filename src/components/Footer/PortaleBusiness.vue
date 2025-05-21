<template>

 

  <div>
    <h4 class="font-bold">Area Agenzie</h4>
    <div class="text-sm">
      <ul>
        <li>
          <Button
            @click="navigatePortale"
            class="mb-2"
            label="Area Dipendenti"
            severity="contrast"
            raised
          />
          <Dialog
            v-model:visible="visibleAllert"
            :style="{ width: '50vw' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
            modal
            header="Attenzione">
            <AllertDialog
              :message="'Token non valido'"
              :isRegister="false"
              :isLogin="true"
              @close="closeDialog"
              @goToLogin="goToLogin"
            />
          </Dialog>
        </li>

        <li>
          <Button
            class="mb-2"
            label="Accedi come agente immobiliare"
            severity="contrast"
            @click="openDialog"
            raised
          />
          <Dialog
            v-model:visible="visible"
            :style="{ width: '50vw' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
            modal
            header="Login"
          >
            <LoginDialog @close="closeDialog" :dipendente="true"></LoginDialog>
          </Dialog>
        </li>
      </ul>
    </div>
     
  </div>
</template>

<script setup>
import AllertDialog from "../Dialogs/AllertMessageDialog.vue"
import Button from "primevue/button";
import { ref } from "vue";
import Dialog from "primevue/dialog";
import LoginDialog from "../Dialogs/LoginDialog.vue";
import { useRouter } from "vue-router";
import { isTokenValid } from "../../services/UserService";
import { useEmployeeStore } from "../../stores/EmployeeStore";

const employeeStore = useEmployeeStore();
const router = useRouter();
const visible = ref(false);
const visibleAllert = ref(false);

function openDialog() {
  visible.value = true;
}

function closeDialog() {
  visible.value = false;
}

function goToLogin() {
  visibleAllert.value = false;
  visible.value = true;
}

async function navigatePortale() {
  // Naviga alla pagina desiderata
  const valid = await isTokenValid(employeeStore.employee.email);
  console.log("validità token", valid);
  if (valid) {
    router.push({ name: "pannellStaff" });
  } else {
    // Mostra un messaggio di errore o gestisci il caso in cui il token non è valido
    visibleAllert.value = true;
  }
}
</script>
