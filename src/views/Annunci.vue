<template>

    <div class="w-full flex flex-row gap-2 m-2">
        <div class="menuLaterale w-150 h-screen p-4 overflow-y-auto">
            <ContenutoMenuFiltro />
        </div>
        <div class="lista-annunci w-full">
            <ListaAnnunci />
        </div>
    </div>

</template>

<script setup>
import { reactive } from 'vue';

import ListaAnnunci from '../components/ListaAnnunci/ListaAnnunci.vue';
import MenuLaterale from '../components/ListaAnnunci/MenuLateraleFiltroRicerca.vue';
import ContenutoMenuFiltro from '../components/ListaAnnunci/ContenutoMenuFiltro.vue';
import { FiltroAnnuncioRequest } from '../dto/FiltroAnnunciRequest.js';

const filtroAnnunci = reactive(new FiltroAnnuncioRequest());



</script>