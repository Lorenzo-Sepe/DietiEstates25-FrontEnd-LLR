<template>
    <div class="flex flex-col items-center justify-between p-2 bg-primary-100 rounded">
        <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="rounded flex flex-col gap-4 justify-center items-center p-5 fluid w-full sm:w-1/2">
            <div class="flex flex-col gap-1 fluid w-full">
                <InputText v-model="signInRequest.usernameOrEmail" name="emailOrUsername" type="text" placeholder="Email or Username" fluid />
                <Message v-if="$form.emailOrUsername?.invalid " severity="error" size="small" variant="simple">{{ $form.emailOrUsername.error?.message }}</Message>
                    
                <Password :feedback="false" v-model="signInRequest.password" name="password" placeholder="Password" fluid :class="{'p-invalid': errorMessage}" toggleMask/>
                <Message v-if="$form.password?.invalid " severity="error" size="small" variant="simple">{{ $form.password.error?.message  }}</Message>
            </div>
            <Button :loading="loading" type="submit" raised severity="secondary" label="Submit" />
        </Form>
        
        <div v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</div>
    </div>
</template>

<script setup>
import { reactive,ref,watch } from 'vue';
import AuthService from '../../services/AuthService';
import SignInRequest from '../../dto/signInRequest'; 
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { Form } from '@primevue/forms';
import { useEmployeeStore } from '../../stores/EmployeeStore';
import { useRoute, useRouter } from 'vue-router'
import  Password  from 'primevue/password';

const router = useRouter();
const route = useRoute();

const loading = ref(false);

const errorMessage = ref('');

const initialValues = reactive({
    emailOrUsername: '',
    password: ''
});

const signInRequest = ref(
    {
        usernameOrEmail: '',
        password: ''
    }
)

const resolver = ({ values }) => {
    const errors = {};

    if (!values.emailOrUsername) {
        errors.emailOrUsername = [{ message: 'Inserire Email o Username.' }];
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
    errorMessage.value = '';
    console.log(signInRequest.value);
    
    const { errors } = resolver({ values: signInRequest.value });

    if (Object.keys(errors).length > 0) {
        loading.value = false;
        return;
    }

    if (valid) {
        try {
            const response = await AuthService.login({
                usernameOrEmail: signInRequest.value.usernameOrEmail,
                password: signInRequest.value.password
            });
            
            loading.value = false;
            router.push({ path: '/' });
        } catch (error) { 
            console.error(error);
            if (error.response) {
                errorMessage.value = error.response.data;
            } else {
                errorMessage.value = 'Errore di rete o di configurazione: ' + error.message;
            }
            loading.value = false;
        }
    }
}

</script>