<template>

    <div
        class="w-full h-100 overflow-y-auto shadow-[0_0_0_4px_rgba(0,0,0,0.05)] rounded-md bg-gray-100 lg:p-4 flex flex-col gap-2 items-start justify-start">


        <div  v-if="mostraButtonNuovaProposta" class="w-full p-4">
            <Button class="w-full" label="Fai la tua proposta" @click="mostraDialogFormProposta = true" />
            <Dialog v-model:visible="mostraDialogFormProposta" modal header="FORM NUOVA PROPOSTA"
                :style="{ width: '30rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
                <FormNuovaProposta :prezzo="prezzoImmobile" @inviaNuovaProposta="inviaNuovaProposta" />
            </Dialog>
        </div>

        <div v-else class="w-full p-4">
            <span>Accedi per poter fare la tua proposta</span>
            <Button label="Accedi" />
        </div>

        <Accordion value="0" class="accordiations w-full">
            <AccordionPanel value="0" class="descrizione">
                <AccordionHeader>PROPOSTE EFFETTUATE</AccordionHeader>
                <AccordionContent>
                    <div class="p-4 w-full">
                        <Tag :value="'Proposte in trattative'" :severity="'warn'" class="mb-2" />

                        <DataTable :value="filterProposteInTrattativa(props.proposte)">
                            <Column field="datiProponente.nome" header="Nome" sortable></Column>
                            <Column field="datiProponente.cognome" header="Cognome" sortable></Column>
                            <Column field="prezzoProposta" header="Proposta" sortable>
                                <template #body="slotProps">
                                    <span :class="{ 'line-through': slotProps.data.controproposta !== null }">
                                        {{ slotProps.data.prezzoProposta }}
                                    </span>
                                </template>
                            </Column>
                            <Column field="controproposta" header="Controproposta" sortable></Column>
                            <Column headerStyle="width:4rem">
                            </Column>
                        </DataTable>
                    </div>

                    <div class="p-4 w-full">
                        <Tag class="mb-2" :value="'Proposte accettate'" :severity="'success'" />
                        <DataTable :value="filterProposteAccettate(props.proposte)">
                            <Column field="datiProponente.nome" header="Nome" sortable></Column>
                            <Column field="datiProponente.cognome" header="Cognome" sortable></Column>
                            <Column field="prezzoProposta" header="Proposta" sortable></Column>
                            <Column field="controproposta" header="Controproposta" sortable></Column>
                        </DataTable>
                    </div>

                    <div class="p-4 w-full">
                        <Tag class="mb-2" :value="'Proposte rifutate'" :severity="'danger'" />
                        <DataTable :value="filterProposteRifiutate(props.proposte)">
                            <Column field="datiProponente.nome" header="Nome" sortable></Column>
                            <Column field="datiProponente.cognome" header="Cognome" sortable></Column>
                            <Column field="prezzoProposta" header="Proposta" sortable></Column>
                            <Column field="controproposta" header="Controproposta" sortable></Column>
                        </DataTable>
                    </div>

                </AccordionContent>
            </AccordionPanel>
        </Accordion>

    </div>

</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';

import { useStoreUtente } from '../../stores/UserStore.js'

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Dialog from 'primevue/dialog';

import FormNuovaProposta from '../../components/DettaglioAnnuncio/FormNuovaProposta.vue';

const userStore = useStoreUtente()

const props = defineProps(['proposte', 'contratto'])
const emit = defineEmits(['inviaNuovaProposta']);

const mostraDialogFormProposta = ref(false);

const mostraButtonNuovaProposta = ref(false);

const prezzoImmobile = ref(0);


onMounted( async () => {

    setPrezzoImmobile();

    try{

        await userStore.aggiorna();
        
    }catch (error) {

        console.error('Errore durante aggiornamento di userStore:', error);
    }finally {

        if(!userStore.isTokenScaduto()) {

            mostraButtonNuovaProposta.value = true;
        }
    }
});

const setPrezzoImmobile = () => {

    if(props.contratto.tipoContratto==="AFFITTO"){

        prezzoImmobile.value = props.contratto.contrattoAffittoResponse.prezzoAffitto;

    }else{

        prezzoImmobile.value = props.contratto.contrattoVenditaResponse.prezzoVendita;
    }
};

const filterProposteAccettate = (proposte) => {

    return proposte ? proposte.filter(proposta => proposta.stato === 'ACCETTATO') : [];
};

const filterProposteRifiutate = (proposte) => {

    return proposte ? proposte.filter(proposta => proposta.stato === 'RIFIUTATO') : [];
};

const filterProposteInTrattativa = (proposte) => {

    return proposte ? proposte.filter(proposta => proposta.stato === 'IN_TRATTAZIONE') : [];
};

const inviaNuovaProposta = (prezzo) => {

    console.log("arrivo quiiiii",prezzo);
    emit('inviaNuovaProposta', prezzo);
}

</script>