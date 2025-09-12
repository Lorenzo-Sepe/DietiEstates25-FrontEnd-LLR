<template>

    <Dialog v-model:visible="visible" modal header="Account" :style="{ width: '400px' }">
        <div class="flex flex-col items-center text-center space-y-4">
            <img :src="avatarUrl" alt="Avatar" class="w-24 h-24 rounded-full shadow" />
            <div>
                <h3 class="text-xl font-semibold">{{ nomeVisualizzato }}</h3>
                <p class="text-gray-500">{{ email }}</p>
            </div>

            <Button label="Aggiungi contatto" icon="pi pi-address-book" class="w-full p-button-secondary"
                @click="addContact" :disabled="isLoggingOut" />

            <Button label="Cambia Password" icon="pi pi-key" class="w-full p-button-secondary" @click="changePassword"
                :disabled="isLoggingOut" />
            <Button label="Logout" icon="pi pi-sign-out" class="w-full p-button-danger" @click="logout"
                :loading="isLoggingOut" disabled:isLoggingOut />
            <Message v-if="erroreLogout" severity="error" text="Errore durante il logout. Riprova." class="w-full" />

            <!-- Slot/placeholder per future estensioni -->
            <slot name="extraInfo" />
        </div>
    </Dialog>

    <Dialog v-model:visible="dialogChangePassword" :style="{ width: '50vw' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :closable modal header="Cambia Password">
        <PopUpCambioPassword @close="dialogChangePassword = false" @password-cambiata="dialogChangePassword = false">
        </PopUpCambioPassword>
    </Dialog>

    <Dialog v-model:visible="dialogAddContact" :style="{ width: '35vw' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :closable modal header="Aggiungi Contatto">

        <PopUpAddContact :contatti="storeEmployee.getContatti" />

    </Dialog>

</template>

<script setup>
import { ref, defineProps } from "vue";
import PopUpCambioPassword from "../Dialogs/PopUpCambioPassword.vue";
import PopUpAddContact from "../Dialogs/PopUpAddContact.vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { Message } from "primevue";

import { useStoreUtente } from "../../stores/UserStore";
import { useEmployeeStore } from "../../stores/EmployeeStore";

const storeEmployee = useEmployeeStore();

import { useRouter } from "vue-router"

const router = useRouter();

const visible = ref(false);

const props = defineProps({
  avatarUrl: {
    type: String,
    default: "https://placehold.co/400x400/4B00B4/FFFFFF?text=P",
  },
  nomeVisualizzato: {
    type: String,
    required: true,
    default: "Nome Visualizzato",
  },
  email: {
    type: String,
    default: "",
  },
});

const dialogChangePassword = ref(false);
const changePassword = () => {
  dialogChangePassword.value = true;
};

const dialogAddContact = ref(false);
const addContact = () => {
  dialogAddContact.value = true;
};

const isLoggingOut = ref(false);
const storeUtente = useStoreUtente();
const erroreLogout = ref(false);

async function logout() {
  isLoggingOut.value = true;
  erroreLogout.value = false;
  try {
    if (props.isInPortale) {
      await useEmployeeStore().logout();
      router.push("/PortaleAgenzia");
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

function apriImpostazioni() {
    console.log("Apro dialog")
    visible.value = true
    emit('chiudiDrawer')
}

defineExpose({ apriImpostazioni })

</script>