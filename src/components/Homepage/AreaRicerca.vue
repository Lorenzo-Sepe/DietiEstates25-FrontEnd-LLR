<template>
        <Fluid class="flex flex-col gap-[1rem] justify-around">
            <div class="flex flex-row gap-[1rem]">
                <ToggleVenditaAffitto :contrattoSelezionato="datiInputRicerca.tipoContratto" />
                <SelectTipoImmobile class="min-w-41" :tipoImmobileSelezionato="datiInputRicerca.tipoImmobile"/>
                <InputRicerca class="w-full" :luogoCercato="datiInputRicerca.luogoCercato" />
            </div>
        <Button label="Cerca" icon="pi pi-search" @click="clickCerca" />
        </Fluid>
</template>

<script setup>
import { ref } from "vue"
import { useRouter, useRoute } from 'vue-router';

import  Fluid  from "primevue/fluid"
import InputRicerca from "../Homepage/InputRicerca.vue"
import SelectTipoImmobile from "../Homepage/SelectTipoImmobile.vue"
import ToggleVenditaAffitto from "../Homepage/ToggleVenditaAffitto.vue"
import Button from "primevue/button"

const router = useRouter();
const route = useRoute()

const datiInputRicerca = {

    luogoCercato: ref({comune: ''}),
    tipoImmobile: ref({name: 'APPARTAMENTO'}),
    tipoContratto: ref("AFFITTO")
}

const clickCerca = () => {

    const comune = datiInputRicerca.luogoCercato.value.comune
    const tipoImmobile = datiInputRicerca.tipoImmobile.value.name
    const tipoContratto = datiInputRicerca.tipoContratto.value
    const latitutine = datiInputRicerca.luogoCercato.value.latitudine
    const longitudine = datiInputRicerca.luogoCercato.value.longitudine
   
    router.push({

         path: '/annunci', 
         query: { ...route.query, comune: comune, immobile: tipoImmobile, contratto: tipoContratto, page: 1, lat: latitutine, lon: longitudine, ordineDataDesc: true } 
        
        });
}


</script>