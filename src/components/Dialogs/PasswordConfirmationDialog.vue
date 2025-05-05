<template>
       <Form v-slot="$form" 
              :resolver 
              :validate-on-blur
              @submit="confirmPasswordAction" 
              class="flex flex-col gap-4">

              <FormField v-slot="$field" name="password" initialValue="" class="flex flex-col gap-1">
                <Password 
                    fluid 
                    :mediumRegex="mediumRegex"
                    :strongRegex="strongRegex"
                    v-model="localPassword" 
                    placeholder="Inserisci la tua password" />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
              </FormField>

              <FormField v-slot="$field" name="confirmPassword" initialValue="" class="flex flex-col gap-1">
                <Password fluid v-model="localConfirmPassword" :feedback="false" placeholder="Conferma la tua password" />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
              </FormField>
            <Button label="Conferma" type="submit" :disabled="$form.$invalid"/>
        </Form>
 
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { Form ,FormField} from '@primevue/forms';

import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';
import AuthService from '../../services/AuthService';
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['close']);

const mediumRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!?\-_]).{8,11}$/;
const strongRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$£%^&+=!?\-_]).{12,16}$/;


const { loginWithPopup, user } = useAuth0();
const router = useRouter();

const props = defineProps({
    currentProvider: String,
});


const localPassword = ref('');
const localConfirmPassword = ref('');

const resolver = ({ values }) => {
    const errors = {};

    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$£%^&+=!?\-_]).{8,16}$/;
    if (!passwordPattern.test(values.password)) {
        errors.password = [{ message: 'La password deve avere tra 8 e 16 caratteri e includere almeno un numero, una lettera maiuscola, una lettera minuscola e un simbolo.' }];
    }

    if (values.password !== values.confirmPassword) {
        errors.confirmPassword = [{ message: 'Le password non corrispondono.' }];
    }

    return {
        errors
    };
};

const confirmPasswordAction = () => {
    const validationResult = resolver({ values: { password: localPassword.value, confirmPassword: localConfirmPassword.value } });
    
    if (Object.keys(validationResult.errors).length > 0) {
        // Gestisci gli errori di validazione qui, ad esempio mostrando un messaggio all'utente
        console.error('Errori di validazione:', validationResult.errors);
        return; // Non procedere se ci sono errori
    }

    handleLogin(props.currentProvider);
   
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

        const response = await AuthService.register({
            username: user.value.email,
            email: user.value.email,
            nomeVisualizzato: user.value.name,
            password: localPassword.value
        });
        router.push({ name: 'confirmRegistration', params: { message: encodeURIComponent(response)} });
    } catch (error) {
        console.error('Login fallito:', error);
        emit('close', error); // Passa l'errore al genitore
    }
};
</script>

<style>
/* Aggiungi eventuali stili personalizzati qui */
</style> 