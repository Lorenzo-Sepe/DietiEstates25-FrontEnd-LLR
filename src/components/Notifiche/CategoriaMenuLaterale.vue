<template>

    <div class="flex justify-between items-center p-1 gap-4 w-full hover:bg-[#ECFDF5]/60! cursor-pointer">
        <div class="flex-1 flex flex-col">
            <span class="font-medium">{{ props.categoria.nomeCategoria }}</span>
            <span class="text-sm text-surface-500">{{ props.categoria.descrizioneCategoria }}</span>
        </div>
        <Button class="w-18 h-10 text-xs sm:text-sm"  v-if="props.categoria.attivo" label="Disattiva" /> 
        <Button class="w-18 h-10 text-xs sm:text-sm" v-else label="Attiva" />
    </div>

</template>

<script setup>
import { ref, defineProps } from 'vue';
import { Button } from 'primevue';

const props = defineProps(['categoria']);

</script>