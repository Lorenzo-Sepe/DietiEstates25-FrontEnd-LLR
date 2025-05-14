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
import Button from "primevue/button";
import { ref } from "vue";
import Dialog from "primevue/dialog";
import LoginDialog from "../Dialogs/LoginDialog.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const visible = ref(false);

function openDialog() {
  visible.value = true;
}

function closeDialog() {
  visible.value = false;
}

function navigatePortale() {
  // Naviga alla pagina desiderata
  router.push("/PortaleAgenzia");
}
</script>
