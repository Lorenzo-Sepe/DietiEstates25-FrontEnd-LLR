<template>

    <div class="w-full h-80 flex flex-row gap-2 bg-red-100 p-2">

        <div class="immagine">
           <img class="w-[25rem] h-full" src="https://primefaces.org/cdn/primevue/images/galleria/galleria1.jpg" alt="Annuncio" />
        </div>

        <div class="informazioni flex flex-col items-start w-full">
            <h2>Titolo</h2>
            <h3>750.000</h3>
            <p class="text-left">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
        </div>

    </div>

</template>

<script setup>
import { ref, onMounted } from "vue";

</script>