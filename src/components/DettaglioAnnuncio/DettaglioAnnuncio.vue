<template>

    <div class="w-full h-full flex felx-col gap-2 md:flex-row bg-gray-100" v-if="isAnnuncioCompleto(props.annuncio)">

        <div class="area-annuncio w-full md:w-[90%] lg:w-[50%] flex flex-col gap-2 mx-auto">

            <div class="intestazione-schemi-piccoli w-full p-2 block lg:hidden">
                <Button label="Mostra contatti agenti" @click="mostraDialogCardAgente = true" />
                <Dialog v-model:visible="mostraDialogCardAgente" modal header="Contatti agente"
                    :style="{ width: '100%' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                    <CardContattiAgente />
                </Dialog>
            </div>

            <div v-if="props.annuncio.immobile.immagini" class="area-foto w-full p-8 bg-white">
                <Galleria :immagini="props.annuncio.immobile.immagini" />
            </div>

            <div class="info-principali w-full flex flex-col p-2 items-start bg-white gap-2">
                <Tag value="Primary">{{ props.annuncio.contratto.tipoContratto }}</Tag>
                <span class="titolo text-4xl font-bold text-left">{{ props.annuncio.titolo }}</span>
                <span class="indirizzo text-lg text-left">{{ props.annuncio.immobile.indirizzo.via }}, {{
                    props.annuncio.immobile.indirizzo.numeroCivico }} - {{ props.annuncio.immobile.indirizzo.citta }} -
                    {{
                        props.annuncio.immobile.indirizzo.cap }}</span>
                <span v-if="props.annuncio.contratto.tipoContratto == 'AFFITTO'"
                    class="indirizzo text-3xl text-left font-bold">{{
                        formattaPrezzo(props.annuncio.contratto.contrattoAffittoResponse.prezzoAffitto) }} € /mese</span>
                <span v-else class="indirizzo text-3xl text-left font-bold">{{
                    formattaPrezzo(props.annuncio.contratto.contrattoVenditaResponse.prezzoVendita) }} €</span>

            </div>

            <div class="accordions w-full flex flex-col p-2 items-start bg-white">

                <Accordion value="0" class="accordiations w-full">

                    <AccordionPanel value="0" class="descrizione">
                        <AccordionHeader>DESCRIZIONE</AccordionHeader>
                        <AccordionContent>
                            <span class="text-left text-xl">
                                {{ props.annuncio.descrizione }}
                            </span>
                        </AccordionContent>
                    </AccordionPanel>

                    <AccordionPanel value="1" class="caratteristiche mt-2">
                        <AccordionHeader>CARATTERSTICHE IMMOBILE</AccordionHeader>
                        <AccordionContent>
                            <div class="flex flex-col gap-2">
                                <span v-if="props.annuncio.immobile.caratteristicheAggiuntive.ascensore">Nel palazzo è presente l'ascensore</span>
                                <span v-if="props.annuncio.immobile.caratteristicheAggiuntive.balconi">Sono presenti uno o più balconi</span>
                                <span v-if="props.annuncio.immobile.caratteristicheAggiuntive.cantina">L'immobile dispone di una cantina</span>
                                <span v-if="props.annuncio.immobile.caratteristicheAggiuntive.soffitta">L'immobile dispone di una soffitta</span>
                                <span v-if="props.annuncio.immobile.caratteristicheAggiuntive.climatizzatori">Sono presenti uno o più condizionatori</span>
                                <span v-if="props.annuncio.immobile.caratteristicheAggiuntive.garage">È compreso il garage</span>
                                <span v-if="props.annuncio.immobile.caratteristicheAggiuntive.postiAuto">È compreso il posto auto</span>
                                <span v-if="props.annuncio.immobile.caratteristicheAggiuntive.giardino">L'immobile dispone di un giardino</span>
                                <span v-if="props.annuncio.immobile.caratteristicheAggiuntive.pannelliSolari">Impianto fotovoltaico installato per la produzione di energia elettrica autonoma</span>
                                <span v-if="props.annuncio.immobile.caratteristicheAggiuntive.portiere">Servizio di portineria presente</span>
                                <span v-if="props.annuncio.immobile.caratteristicheAggiuntive.riscaldamentoCentralizzato
">L’immobile dispone di riscaldamento centralizzato.</span>
<span v-if="props.annuncio.immobile.caratteristicheAggiuntive.descrizioneAggiuntiva
">{{ props.annuncio.immobile.caratteristicheAggiuntive.descrizioneAggiuntiva }}</span>

                            </div>
                        </AccordionContent>
                    </AccordionPanel>


                </Accordion>


            </div>

        </div>

        <div class="area-contatti-agente w-[40%] flex flex-col gap-2 mx-auto hidden lg:block p-2">
            <CardContattiAgente />
        </div>

    </div>

    <div v-else class="w-full h-screen">
        <ScheletroPagina />
    </div>

</template>

<script setup>
import { ref, onMounted, defineProps, computed } from 'vue';
import { useRoute } from 'vue-router';

import Galleria from '../../components/DettaglioAnnuncio/Galleria.vue';
import CardContattiAgente from '../../components/DettaglioAnnuncio/CardContattiAgente.vue';
import ScheletroPagina from '../../components/DettaglioAnnuncio/ScheletroPagina.vue'

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const route = useRoute();

const props = defineProps(['annuncio']);

const mostraDialogCardAgente = ref(false);

const isAnnuncioCompleto = (annuncio) => {
    return annuncio &&
        annuncio.immobile &&
        annuncio.immobile.indirizzo &&
        annuncio.immobile.immagini &&
        annuncio.contratto &&
        (annuncio.contratto.contrattoAffittoResponse || annuncio.contratto.contrattoVenditaResponse) &&
        annuncio.immobile.caratteristicheAggiuntive;
}

onMounted(() => {

    console.log('figlio annuncio:', props.annuncio);
});

function formattaPrezzo(prezzoStringa) {
    // Converte in numero e formatta con separatore delle migliaia
    return Number(prezzoStringa).toLocaleString('it-IT');
}

</script>