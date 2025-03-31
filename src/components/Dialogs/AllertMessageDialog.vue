<template>
    <div>
        <p>{{ message }}</p>
        <Button 
            :label="isRegister ? 'Registrati' : 'Chiudi'" 
            @click="isRegister ? goToRegister : closeDialog" 
        />
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const props = defineProps({
    message: {
        type: String,
        required: true
    },
    isRegister: {
        type: Boolean,
        default: false
    }
});

const router = useRouter();

const closeDialog = () => {
    router.push('/');
};

const goToRegister = () => {
    router.push('/register');
};
</script>