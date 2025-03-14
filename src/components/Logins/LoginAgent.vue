<template>
    <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit"  class="rounded flex flex-col gap-4 justify-center items-center p-5 w-full sm:w-56">
        <div class="flex flex-col gap-1 ">
                <InputText v-model="signInRequest.usernameOrEmail" name="emailOrUsername" type="text" placeholder="Email or Username" fluid />
                <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{ $form.email.error?.message }}</Message>
                <InputText v-model="signInRequest.password" name="password" type="password" placeholder="Password" fluid />
                <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{ $form.email.error?.message }}</Message>

        </div>
        <Button :loading="loading" type="submit" raised severity="secondary" variant="outlined" label="Submit" />
    </Form>
</template>

<script setup>
import { reactive,ref } from 'vue';
import AuthService from '../../service/AuthService';
import SignInRequest from '../../dto/signInRequest'; 
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { Form } from '@primevue/forms';
import { useUserStore } from '../../stores/UserStore';
import { useRoute, useRouter } from 'vue-router'

const router = useRouter();
const route = useRoute();

const userInstance = useUserStore(); 
const loading = ref(false);

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

const onFormSubmit = ({ valid }) => {
    loading.value = true;
    const signInRequest = new SignInRequest()
    .usernameOrEmail();

    if (valid) {
        try{
            const response = await AuthService.login({
                usernameOrEmail: signInRequest.usernameOrEmail,
                password: signInRequest.password
            });
            userInstance.setUser({
                username: response.value.username,
                email: response.value.email,
                tokenAgent: response.value.token,
                dipendente: true,
                authority : response.value.authority
            });
            loading.value = false;
            router.push({path:'/'});
            }catch (error) { 
                console.error(error);
                loading.value = false;
            }
        }
    }


</script>