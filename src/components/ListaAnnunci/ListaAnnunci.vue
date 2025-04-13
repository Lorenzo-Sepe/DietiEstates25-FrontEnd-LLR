<template>


    <!--------------------------------------------DIALOG MAPPA----------------------------------------------------------------->

    <Dialog v-model:visible="dialogMappa" modal header="MAPPA" :style="{ width: '50rem', height: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <AnnuncioNellaMappa />
    </Dialog>

    <!-------------------------------------------------------------------------------------------------------------------------->


    <div v-for="annuncio in annunci" :key="annuncio.id"
        class="w-[95%] h-150 lg:h-80 flex flex-col lg:flex-row bg-white gap-4 mb-4 border border-gray-200 rounded-md">

        <div
            class="immagine w-full h-45 lg:w-115 lg:h-full md:w-90 md:mx-auto md:mt-1 border border-gray-200 rounded-md">
            <Galleria :immagini="annuncio.immobile.immagini" />
        </div>

        <div class="informazioni flex flex-col items-start w-full">

            <div class="contratto mt-2 p-2 flex flex-row justify-between w-full">
                <Tag value="Primary">{{ annuncio.contratto.tipoContratto }}</Tag>
                <span class="text-sm font-medium">Pubblicato il: {{ annuncio.dataCreazione[2] }}/{{
                    annuncio.dataCreazione[1] }}/{{ annuncio.dataCreazione[0] }}</span>

            </div>

            <div class="titolo h-20 mt-1 items-start justify-start flex flex-col w-full">
                <span class="text-xl text-green-600 hover:underline cursor-pointer">{{ annuncio.titolo }}</span>
                <span class="text-xs text-blue-600 underline cursor-pointer" @click="dialogMappa = true">Mostra sulla
                    mappa</span>
            </div>

            <div class="prezzo mb-2">
                <span v-if="annuncio.contratto.tipoContratto === 'AFFITTO'" class="font-bold text-3xl">{{
                    formattaPrezzo(annuncio.contratto.contrattoAffittoResponse.prezzoAffitto) }} €/mese</span>
                <span v-else class="font-bold text-3xl">{{
                    formattaPrezzo(annuncio.contratto.contrattoVenditaResponse.prezzoVendita) }} €</span>

            </div>

            <div class="descrizione w-full h-20">
                <p class="text-left clamp-2-lines text-base text-gray-700 leading-relaxed">{{ annuncio.descrizione }}
                </p>
            </div>

            <div v-if="annuncio.immobile.indirizzo.vicinoA.length > 0"
                class="luoghi-di-interesse flex flex-col gap-2 items-start mt-1 w-full">

                <span class="font-bold">Immobile vicino a: </span>

                <div class="flex flex-col md:flex-row gap-2 w-full items-start">
                    <Tag
                        style="border: 2px solid var(--border-color); background: transparent; color: var(--text-color)">
                        <div class="flex items-center gap-2 px-1">
                            <img alt="Country" src="../../assets/Icon/autobus.png" class="flag flag-it"
                                style="width: 18px" />
                            <span class="text-base">Trasporti pubblici</span>
                        </div>
                    </Tag>
                    <Tag
                        style="border: 2px solid var(--border-color); background: transparent; color: var(--text-color)">
                        <div class="flex items-center gap-2 px-1">
                            <img alt="Country" src="../../assets/Icon/scuola.png" class="flag flag-it"
                                style="width: 18px" />
                            <span class="text-base">Scuole</span>
                        </div>
                    </Tag>
                    <Tag
                        style="border: 2px solid var(--border-color); background: transparent; color: var(--text-color)">
                        <div class="flex items-center gap-2 px-1">
                            <img alt="Country" src="../../assets/Icon/parcheggio.png" class="flag flag-it"
                                style="width: 18px" />
                            <span class="text-base">Parcheggi</span>
                        </div>
                    </Tag>
                </div>

            </div>

        </div>

    </div>

</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";

import { AnnuncioImmobiliareResponse } from "../../dto/Response/AnnuncioImmobiliareResponse";

import Galleria from '../ListaAnnunci/Galleria.vue';
import AnnuncioNellaMappa from '../ListaAnnunci/AnnuncioNellaMappa.vue';

import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';


const dialogMappa = ref(false);


const props = defineProps({

    annunci: {

        type: [AnnuncioImmobiliareResponse],
        required: true
    }
});

function formattaPrezzo(prezzoStringa) {
    // Converte in numero e formatta con separatore delle migliaia
    return Number(prezzoStringa).toLocaleString('it-IT');
}

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