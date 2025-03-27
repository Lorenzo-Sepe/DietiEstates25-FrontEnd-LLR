<template>
    <Button severity="primary" @click="handleLogin" variant="link" label="Accedi con social Media" class="button__login"
        ></Button
    >
</template>

<script setup>
import Button from 'primevue/button';
import { useAuth0 } from '@auth0/auth0-vue';

import { useUserStore } from '../../stores/UserStore';
const { loginWithRedirect,loginWithPopup } = useAuth0();

const userStoreinstance = useUserStore();

const handleLogin = () => {
    userStoreinstance.clearUser();

    loginWithRedirect();
};
</script>
