<template>
    <div class="flex flex-col items-center justify-between p-2 bg-primary-100 rounded">
        <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="rounded flex flex-col gap-4 justify-center items-center p-5 fluid w-full sm:w-1/2">
            <div class="flex flex-col gap-1 fluid w-full">
                <InputText fluid v-model="signInRequest.usernameOrEmail" name="email" type="text" placeholder="Email"  />
                <Message v-if="$form.email?.invalid " severity="error" size="small" variant="simple">{{ $form.email.error?.message }}</Message>
                
                <Password fluid :feedback="false" v-model="signInRequest.password" name="password" placeholder="Password"  :class="{'p-invalid': errorMessage}" toggleMask/>
                <Message v-if="$form.password?.invalid " severity="error" size="small" variant="simple">{{ $form.password.error?.message  }}</Message>
            </div>
            <Button :loading="loading" type="submit" raised severity="secondary" label="Submit" />
        </Form>
        
        <div v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</div>
    </div>
</template>

<script setup>
import { reactive, ref, defineEmits } from 'vue';
import {  useRouter } from 'vue-router'

import  Message  from 'primevue/message';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import  Password  from 'primevue/password';
import { Form } from '@primevue/forms';

import AuthService from '../../services/AuthService';

const emit = defineEmits(["close"]);
const router = useRouter();

const loading = ref(false);
const errorMessage = ref('');

const initialValues = reactive({
    email: '',
    password: ''
});

const signInRequest = ref({
    usernameOrEmail: '',
    password: ''
});

const validaEmail = (email) => {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regexEmail.test(email);
};

const resolver = ({ values }) => {
    const errors = {};

    if (!values.email) {
        errors.email = [{ message: 'Inserire Email' }];
    } else if (!validaEmail(values.email)) { // Corretto il controllo dell'email
        errors.email = [{ message: 'Inserire un email valida' }];
    }

    if (!values.password) {
        errors.password = [{ message: 'Inserire Password.' }];
    }

    return {
        values, // (Optional) Used to pass current form values to submit event.
        errors
    };
};

const onFormSubmit = async ({ valid }) => {
    loading.value = true;
    if (!valid) {
        loading.value = false; // Assicurati di fermare il caricamento se non è valido
        return;
    }
    
    errorMessage.value = '';
    console.log(signInRequest.value);
    
    try {
        const response = await AuthService.login({
            Email: signInRequest.value.usernameOrEmail,
            password: signInRequest.value.password
        });
        
        loading.value = false;
        if (response.ruolo !== 'MEMBER') {
            router.push({ path: '/PortaleAgenzia/pannelloStaff' });
        }
        emit("close");
        
    } catch (error) { 
        console.error(error);
        loading.value = false; // Assicurati di fermare il caricamento in caso di errore
        if (error.response) {
            errorMessage.value = error.response.data;
        } else {
            errorMessage.value = 'Errore di rete o di configurazione: ' + error.message;
        }
    }
}
</script>