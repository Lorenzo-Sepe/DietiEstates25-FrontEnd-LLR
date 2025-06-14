<template>
  <AvatarAccount
    :nomeVisualizzato="nomeVisualizzato"
    :nomeAzienda="nomeAzienda"
    :avatarUrl="avatarUrl"
    @avatarclick="avatarClicked"
    onlyAvatar
  />

  <Dialog
    v-model:visible="visible"
    modal
    header="Account"
    :style="{ width: '400px' }"
  >
    <div class="flex flex-col items-center text-center space-y-4">
      <img
        :src="avatarUrl"
        alt="Avatar"
        class="w-24 h-24 rounded-full shadow"
      />
      <div>
        <h3 class="text-xl font-semibold">{{ nomeVisualizzato }}</h3>
        <p class="text-gray-500">{{ email }}</p>
      </div>

      <Button
        label="Cambia Password"
        icon="pi pi-key"
        class="w-full p-button-secondary"
        @click="changePassword"
        :disabled="isLoggingOut"
      />
      <Button
        label="Logout"
        icon="pi pi-sign-out"
        class="w-full p-button-danger"
        @click="logout"
        :loading="isLoggingOut"
        disabled:isLoggingOut
      />
      <Message
        v-if="erroreLogout"
        severity="error"
        text="Errore durante il logout. Riprova."
        class="w-full"
      />

      <!-- Slot/placeholder per future estensioni -->
      <slot name="extraInfo" />
    </div>
  </Dialog>

  <Dialog
    v-model:visible="dialogChangePassword"
    :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :closable
    modal
    header="Cambia Password"
  >
    <PopUpCambioPassword
      @close="dialogChangePassword = false"
      @password-cambiata="dialogChangePassword = false"
    >
    </PopUpCambioPassword>
  </Dialog>
</template>

<script setup>
import PopUpCambioPassword from "../Dialogs/PopUpCambioPassword.vue";
import AvatarAccount from "./AvatarAccount.vue";
import { ref, defineProps } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useStoreUtente } from "../../stores/UserStore";
import { useEmployeeStore } from "../../stores/EmployeeStore";
import { useRouter } from "vue-router";
import { Message } from "primevue";

const router = useRouter();

const props = defineProps([
  "nomeVisualizzato",
  "nomeAzienda",
  "avatarUrl",
  "email",
  "isInPortale",
]);

const visible = ref(false);

const avatarClicked = () => {
  visible.value = true;
};

const dialogChangePassword = ref(false);
const changePassword = () => {
  dialogChangePassword.value = true;
};

const isLoggingOut = ref(false);
const storeUtente = useStoreUtente();
const storeEmployee = useEmployeeStore();
const erroreLogout = ref(false);

const logout = async () => {
  isLoggingOut.value = true;
  erroreLogout.value = false;
  try {
    if (props.isInPortale) {
      await storeEmployee.logout();
      router.push("/");
    } else {
      await storeUtente.logout();
      router.push("/");
    }

    isLoggingOut.value = false;
  } catch (error) {
    console.error("Errore durante il logout:", error);
    isLoggingOut.value = false;
    erroreLogout.value = true;
  }

  if (!erroreLogout.value) {
    visible.value = false;

    if (props.isInPortale) {
      router.push("/PortaleAgenzia");
    } else {
      router.push("/");
    }
  }
};
</script>
