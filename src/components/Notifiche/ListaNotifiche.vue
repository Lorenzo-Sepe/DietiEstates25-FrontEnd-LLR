<template>

    <div class="flex flex-col items-start my-4">
        <label class="font-bold">{{ route.query.nome }}</label>
        <div class="border-t-2 border-black w-full mx-auto my-2"></div>
    </div>
    <div v-for="notifica in notifiche" class="w-full border-2 border-black rounded-lg p-4 hover:bg-green-400! cursor-pointer">
        <label class="font-medium ">{{ notifica.id }}</label>
    </div>

</template>

<script setup>
import { ref, defineProps } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const props = defineProps(['notifiche']);

</script>