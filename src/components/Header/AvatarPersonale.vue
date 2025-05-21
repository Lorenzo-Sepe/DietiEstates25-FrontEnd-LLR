<template>
  <AvatarAccount
    :nomeVisualizzato="nomeVisualizzato"
    :nomeAzienda="nomeAzienda"
    :avatarUrl="avatarUrl"
    @Avatarclick="avatarClicked"
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
</template>

<script setup>
import AvatarAccount from "./AvatarAccount.vue";
import { ref } from "vue";
import { defineProps } from "vue";
import { Dialog } from "primevue";
import Button from "primevue/button";
import { useStoreUtente } from "../../stores/UserStore";
import { useEmployeeStore } from "../../stores/EmployeeStore";
import { useRouter } from "vue-router";
import {Message} from "primevue";
const props = defineProps([
  "nomeVisualizzato",
  "nomeAzienda",
  "avatarUrl",
  "email",
  "isInPortale"
]);

const visible = ref(false);

const avatarClicked = () => {
  visible.value = true;
};

const changePassword = () => {
  // Logica per cambio password
  alert("TODO: cambia password");
};
const router = useRouter();
const isLoggingOut = ref(false);
const store = useStoreUtente();
const storeEmployee = useEmployeeStore();
const erroreLogout = ref(false);
const logout = async () => {
  isLoggingOut.value = true;
  erroreLogout.value = false;
  try {
    if (props.isInPortale) {
      await storeEmployee.logout();
    } else {
      await store.logout();
    }

    isLoggingOut.value = false;
    visible.value = false;
    if (props.isInPortale) {
      router.push('/PortaleAgenzia');
    } else {
      router.push("/");
    }
  } catch (error) {
    console.error("Errore durante il logout:", error);
    isLoggingOut.value = false;
    erroreLogout.value = true;
  }
};

</script>
