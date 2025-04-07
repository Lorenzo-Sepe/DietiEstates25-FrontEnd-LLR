<template>

    <div
        class="w-[95%] h-130 lg:w-[90%] lg:h-80 flex flex-col lg:flex-row bg-white gap-2 m-auto my-2 border border-gray-200 rounded-md">

        <div class="immagine w-full h-45 lg:w-128 lg:h-full border border-gray-200 rounded-md">
            <img src="https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg" alt="Image"
                class="w-full h-full border border-gray-200 rounded-md" />
        </div>

        <div class="informazioni flex flex-col items-start w-full">

            <div class="tipo-immobile mt-2">
                <Tag value="Primary">Vendita</Tag>
            </div>

            <div class="titolo h-20 mt-1">
                <h3 class="text-xl text-green-600 hover:underline cursor-pointer">Appartamento in affitto in via Francesco Petrarca</h3>
            </div>

            <div class="prezzo mb-2">
                <span class="font-bold text-3xl">750.000 €</span>
            </div>

            <div class="descrizione w-full h-20">
                <p class="text-left clamp-2-lines text-base text-gray-700 leading-relaxed">"Lorem ipsum dolor sit
                    amet, consectetur adipiscing elit, sed
                    do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
                    in
                    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                    non
                    proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
            </div>

        </div>

    </div>

</template>

<script setup>
import { ref, onMounted } from "vue";

import Tag from 'primevue/tag';

</script>

<style scoped>
.clamp-2-lines {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-clamp: 3;
    /* Aggiungi anche la versione senza prefisso */
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>