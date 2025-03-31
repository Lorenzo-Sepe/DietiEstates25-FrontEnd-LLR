<template>
    <div fluid class="card p-4 fluid">
        <h2 class="text-center">Registrazione</h2>
        <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="handleRegister" class="flex flex-col gap-4">
            <InputText 
                fluid 
                v-model="registrationRequest.username" 
                name="username" 
                placeholder="Username" 
                :class="{'p-invalid': $form.username?.invalid}" 
            />
            <Message v-if="$form.username?.invalid" severity="error" size="small">{{ $form.username.error?.message }}</Message>

            <InputText 
                fluid 
                v-model="registrationRequest.email" 
                name="email" 
                placeholder="Email" 
                :class="{'p-invalid': $form.email?.invalid}" 
            />
            <Message v-if="$form.email?.invalid" severity="error" size="small">{{ $form.email.error?.message }}</Message>

            <InputText 
                fluid 
                v-model="registrationRequest.name" 
                name="name" 
                placeholder="Nome Visualizzato" 
                :class="{'p-invalid': $form.name?.invalid}" 
            />
            <Message v-if="$form.name?.invalid" severity="error" size="small">{{ $form.name.error?.message }}</Message>

            <Password 
                fluid 
                v-model="registrationRequest.password" 
                name="password" 
                placeholder="Password" 
                :class="{'p-invalid': $form.password?.invalid}" 
            />
            <Message v-if="$form.password?.invalid" severity="error" size="small">{{ $form.password.error?.message }}</Message>

            <Password 
                fluid 
                v-model="registrationRequest.confirmPassword" 
                name="passwordConfirm" 
                placeholder="Ripeti Password" 
                :class="{'p-invalid': $form.confirmPassword?.invalid}" 
            />
            <Message v-if="$form.confirmPassword?.invalid" severity="error" size="small">{{ $form.confirmPassword.error?.message }}</Message>
            
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

    <Dialog v-model:visible="showDialog" :style="{ width: '50vw' }" modal header="Inserire la password per questo account">
        <Form v-slot="$form" :initialValues="{ password: '', confirmPassword: '' }" :resolver="miniResolver" @submit="confirmPasswordAction" class="flex flex-col gap-4">
            <Password fluid v-model="password" placeholder="Inserisci la tua password" />
            <Message v-if="$form.password?.invalid" severity="error" size="small">{{ $form.password.error?.message }}</Message>

            <Password fluid v-model="confirmPassword" placeholder="Conferma la tua password" />
            <Message v-if="$form.confirmPassword?.invalid" severity="error" size="small">{{ $form.confirmPassword.error?.message }}</Message>

            <Button label="Conferma" type="submit" :disabled="$form.$invalid"/>
        </Form>
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
import { useAuth0 } from '@auth0/auth0-vue';
import Dialog from 'primevue/dialog';

const { loginWithPopup, user } = useAuth0();
const router = useRouter();

const initialValues = reactive({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
});

const registrationRequest = ref(initialValues);
const showDialog = ref(false);
const password = ref('');
const confirmPassword = ref('');
const currentProvider = ref('');
const errorMessage = ref('');

const resolver = ({ values }) => {
    const errors = {};

    if (!values.username || values.username.length < 3 || values.username.length > 20) {
        errors.username = [{ message: 'Username deve avere tra 3 e 20 caratteri.' }];
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(values.email)) {
        errors.email = [{ message: 'Email non valida.' }];
    }

    if (!values.name || values.name.length < 3 || values.name.length > 20) {
        errors.name = [{ message: 'Nome deve avere tra 3 e 20 caratteri.' }];
    }

    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$£%^&+=!]).{8,16}$/;
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

const miniResolver = ({ values }) => {
    const errors = {};

    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$£%^&+=!]).{8,16}$/;
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
        const response = await AuthService.register(registrationRequest.value);
        router.push({ name: 'confirmRegistration', params: { message: response.data, isPasswordVisible: false } });
    } catch (error) {
        console.error('Registrazione fallita:', error);
    }
};

const handleLoginWithDialog = (provider) => {
    showDialog.value = true;
    currentProvider.value = provider;
};

const confirmPasswordAction = () => {
    handleLogin(currentProvider.value);
    showDialog.value = false;
};

const handleLogin = async (provider) => {
    try {
        await loginWithPopup({
            authorizationParams: {
                screen_hint: 'signup',
                connection: provider,
                scope: 'openid profile email'
            }
        });

        const response = await AuthService.registerIdProvvider({
            username: user.value.nickname,
            email: user.value.email,
            nomeVisualizzato: user.value.name,
            password: password.value
        });
        router.push({ name: 'confirmRegistration', params: { message: response.data, isPasswordVisible: true } });
    } catch (error) {
        console.error('Login fallito:', error);
    }
};
</script>

<style>
.card {
    max-width: 400px;
    margin: auto;
}
</style>
