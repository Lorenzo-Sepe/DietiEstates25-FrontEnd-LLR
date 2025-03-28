<template>
    <div class="flex flex-col ">
    <Button icon="pi pi-github" severity="primary" @click="() => handleLogin('github')" variant="link" label="Accedi con GitHub" class="button__login"></Button>
    <Button icon="pi pi-google" severity="primary" @click="() => handleLogin('google')" variant="link" label="Accedi con Google" class="button__login"></Button>
    </div>
</template>

<script setup>
import Button from 'primevue/button';
import { useAuth0 } from '@auth0/auth0-vue';

import { useUserStore } from '../../stores/UserStore';
const { loginWithRedirect,loginWithPopup } = useAuth0();

const userStoreinstance = useUserStore();

const handleLogin = (provider) => {
    loginWithRedirect({
        authorizationParams: {
            screen_hint: 'signup',
            connection: provider
        }
    });
};
</script>
