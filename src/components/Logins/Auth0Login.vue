<template>
    <div class="flex flex-col ">
    <Button icon="pi pi-github" severity="primary" @click="() => handleLoginWithDialog('github')" variant="link" label="Accedi con GitHub" class="button__login"></Button>
    <Button icon="pi pi-google" severity="primary" @click="() => handleLoginWithDialog('google-oauth2')" variant="link" label="Accedi con Google" class="button__login"></Button>
    </div>
    <Dialog v-model:visible="showDialog" :style="{ width: '50vw' }" modal header="Login" :closable>
        <PopUpAuth0 
            @autenticazione-errore="handleErrore"
            @autenticazione-successo="$emit('close', $event)"
            @close="handleDialogClose" 
            modalita="login"
            :showDialog="showDialog" 
            :currentProvider="currentProvider" 
        />
    </Dialog>
</template>

<script setup>
import { Dialog } from 'primevue';
import Button from 'primevue/button';
import PopUpAuth0 from '../Dialogs/PopUpAuth0.vue';
import { ref,defineEmits } from 'vue';

const emit= defineEmits(["close"])
const currentProvider = ref('');
const showDialog = ref(false);

const handleLoginWithDialog = (provider) => {
    showDialog.value = true;
    currentProvider.value = provider;
};

const loginError = ref('');
const handleDialogClose = (error) => {
    showDialog.value = false;
    currentProvider.value = '';
    if (error) {
        loginError.value = error;
        console.error('Errore dal dialogo:', error);
    }
};
const handleErrore = (error)=>{
    if (error) {
        loginError.value = error;
        console.error('Errore dal dialogo:', error);
    }
}

</script>
