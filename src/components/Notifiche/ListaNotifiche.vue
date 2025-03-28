<template>

    <div class="flex flex-col items-start my-4">
        <Tag severity="secondary" class="font-bold">{{ route.query.nome }}</Tag>
        <div class="border-t-2 border-black w-full mx-auto my-2"></div>
    </div>
    <div v-for="notifica in notifiche"
        class="w-full border-2 border-black rounded-lg p-4 hover:bg-green-400! cursor-pointer"
        @click="emit('visualizzaNotifica', notifica)">
        <label class="font-medium ">{{ notifica.id }}</label>
    </div>

</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import Tag from 'primevue/tag';

const router = useRouter();
const route = useRoute();

const props = defineProps(['notifiche']);
const emit = defineEmits(['visualizzaNotifica']);

</script>