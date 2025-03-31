<!-- Start Generation Here -->
<template>
    <div>
        <p>{{ message }}</p>
        <Password v-if="isPasswordVisible" placeholder="Inserisci la tua password" />
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import Password from 'primevue/password';

const props = defineProps({
    message: {
        type: String,
        required: true
    },
    isPasswordVisible: {
        type: Boolean,
        default: false
    }
});
</script>
<!-- End Generation Here -->
