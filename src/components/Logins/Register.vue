<template>
    <div fluid class="card p-4 fluid">
        <h2 class="text-center">Registrazione</h2>
        <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="handleRegister" class="flex flex-col gap-4">
            
            <InputText 
                fluid 
                v-model="initialValues.email" 
                name="email" 
                placeholder="Email" 
                :class="{'p-invalid': $form.email?.invalid}" 
            />
            <Message v-if="$form.email?.invalid" severity="error" size="small">{{ $form.email.error?.message }}</Message>

            <InputText 
                fluid 
                v-model="initialValues.nomeVisualizzato" 
                name="nomeVisualizzato" 
                placeholder="Nome Visualizzato" 
                :class="{'p-invalid': $form.nomeVisualizzato?.invalid}" 
            />
            <Message v-if="$form.nomeVisualizzato?.invalid" severity="error" size="small">{{ $form.nomeVisualizzato.error?.message }}</Message>

            <Password 
                fluid 
                :mediumRegex="mediumRegex"
                :strongRegex="strongRegex"
                v-model="initialValues.password" 
                name="password" 
                placeholder="Password" 
                :class="{'p-invalid': $form.password?.invalid}" 
            />
            <Message v-if="$form.password?.invalid" severity="error" size="small">{{ $form.password.error?.message }}</Message>

            <Password 
                fluid 
                :feedback="false"
                v-model="initialValues.confirmPassword" 
                name="passwordConfirm" 
                placeholder="Ripeti Password" 
                :class="{'p-invalid': $form.confirmPassword?.invalid}" 
            />
            <Message v-if="$form.confirmPassword?.invalid" severity="error" size="small">{{ $form.confirmPassword.error?.message }}</Message>
            
            <Message v-if="registrationError" 
                    severity="error" 
                    size="small">
                    {{ registrationError?.response?.data?.message || 'Errore durante la registrazione.' }}
                </Message>
            
            <Button type="submit" label="Registrati" :disabled="$form.$invalid" />

            <div class="flex justify-between mt-4 gap-1">
                <Button 
                    class="IdP-button" 
                    icon="pi pi-github" 
                    severity="primary" 
                    @click="() => handleLoginWithDialog('github')" 
                    label="Registrati con GitHub" 
                />
                <Button 
                    class="IdP-button" 
                    icon="pi pi-google" 
                    severity="primary" 
                    @click="() => handleLoginWithDialog('google-oauth2')" 
                    label="Registrati con Google" 
                />
            </div>
        </Form>
    </div>
    
    <Dialog v-model:visible="showDialog" :style="{ width: '50vw' }" modal header="Completa la registrazione" :closable>
        <PopUpAuth0 
            @close="handleDialogClose" 
            :showDialog="showDialog" 
            :currentProvider="currentProvider" 
        />
    </Dialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { useRouter } from 'vue-router';
import AuthService from '../../services/AuthService';

import  Dialog  from 'primevue/dialog';
import PopUpAuth0 from '../Dialogs/PopUpAuth0.vue';

const mediumRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!?\-_]).{8,11}$/;
const strongRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$£%^&+=!?\-_]).{12,16}$/;

const router = useRouter();

const initialValues = reactive({
    email: '',
    nomeVisualizzato: '',
    password: '',
    confirmPassword: '',
});

const SignUpRequest = ref(initialValues);
const showDialog = ref(false);
const currentProvider = ref('');
const registrationError = ref('');

const resolver = ({ values }) => {
    const errors = {};


    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(values.email)) {
        errors.email = [{ message: 'Email non valida.' }];
    }

    if (!values.nomeVisualizzato || values.nomeVisualizzato.length < 3 || values.nomeVisualizzato.length > 20) {
        errors.nomeVisualizzato = [{ message: 'Nome deve avere tra 3 e 20 caratteri.' }];
    }

    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$£%^&+=!?\-_]).{8,16}$/;
    if (!passwordPattern.test(values.password)) {
        errors.password = [{ message: 'La password deve avere tra 8 e 16 caratteri e includere almeno un numero, una lettera maiuscola, una lettera minuscola e un simbolo.' }];
    }

    if (values.password !== values.confirmPassword) {
        errors.confirmPassword = [{ message: 'Le password non corrispondono.' }];
    }

    return {
        values,
        errors
    };
};

const handleRegister = async () => {
    try {
        const response = await AuthService.register(SignUpRequest.value);
        console.log('Registrazione avvenuta con successo:', response);
        router.push({ name: 'confirmRegistration', params: { message: encodeURIComponent(response) } });
    } catch (error) {
        registrationError.value = error;
        console.error('Registrazione fallita:', error);
    }
};

const handleLoginWithDialog = (provider) => {
    showDialog.value = true;
    currentProvider.value = provider;
};


const handleDialogClose = (error) => {
    showDialog.value = false;
    if (error) {
        registrationError.value = error;
        console.error('Errore dal dialogo:', error);
    }
};
</script>

<style>
.card {
    max-width: 400px;
    margin: auto;
}
</style>
