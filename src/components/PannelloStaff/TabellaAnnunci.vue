<template>
    <div class="flex flex-col w-full h-full">
        <ScheletroTabella v-if="props.propLoading" />
        <div class="flex-grow">
            <DataTable v-model:expandedRows="expandedRows" :value="props.propAnnunci" dataKey="id"
                tableStyle="min-width: 100%; height: 100%;">
                <template #header>
                    <div class="flex flex-wrap justify-end gap-2">
                        <Button v-if="props.isAgente" label="Aggiungi annuncio immobilare" />
                    </div>
                </template>
                <Column expander style="width: 5rem" />
                <Column field="titolo" header="Titolo"></Column>
                <Column header="Copertina">
                    <template #body="slotProps">
                        <img :src="`${slotProps.data.immobile.immagini[0].url}`" :alt="slotProps.data.image"
                            class="shadow-lg" width="64" />
                    </template>
                </Column>
                <Column header="Prezzo">
                    <template #body="slotProps">
                        <span v-if="slotProps.data.contratto.tipoDiContratto === 'vendita'">
                            {{ slotProps.data.contratto.contrattoVenditaResponse.prezzoVendita }} €
                        </span>
                        <span v-else>
                            {{ slotProps.data.contratto.contrattoAffittoResponse.prezzoAffitto }} €
                        </span>
                    </template>
                </Column>
                <Column field="contratto.tipoContratto" header="Contratto"></Column>
                <Column headerStyle="width:4rem">
                    <template #body>
                        <div class="flex flex-row gap-2">
                            <Button variant="text" rounded aria-label="Filter"
                                v-tooltip="{ value: 'Modifica annuncio', showDelay: 300, hideDelay: 300 }">
                                <template #icon>
                                    <img alt="Modifica annuncio" src="../../assets/Icon/modificaAnnuncio.png" class="w-5 h-5" />
                                </template>
                            </Button>
                            <Button variant="text" rounded aria-label="Filter"
                                v-tooltip="{ value: 'Elimina annuncio', showDelay: 300, hideDelay: 300 }">
                                <template #icon>
                                    <img alt="Elimina annuncio"" src="../../assets/Icon/eliminaAnnuncio.png" class="w-5 h-5" />
                                </template>
                            </Button>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ScheletroTabella from '../PannelloStaff/ScheletroTabella.vue';

const props = defineProps(['propAnnunci', 'propLoading', 'propostaRequest', 'agente', 'isAgente']);
const emit = defineEmits(['nuovaProposta', 'eliminaProposta', 'accettaProposta', 'controproposta']);


const expandedRows = ref([])

const visible = ref(false);
const dialogControproposta = ref(false);
const propostaSelected = ref();
const selectedAnnuncioId = ref(null);

const filterProposteAccettate = (proposte) => {

    return proposte ? proposte.filter(proposta => proposta.stato === 'ACCETTATO') : [];
};

const filterProposteRifiutate = (proposte) => {

    return proposte ? proposte.filter(proposta => proposta.stato === 'RIFIUTATO') : [];
};

const filterProposteInTrattativa = (proposte) => {

    return proposte ? proposte.filter(proposta => proposta.stato === 'IN_TRATTAZIONE') : [];
};

const clickAggiungiPropostaManuale = (id) => {

    selectedAnnuncioId.value = id;
    visible.value = true;
};

const nuovaProposta = () => {

    visible.value = false;

    emit('nuovaProposta');
};

const clickControproposta = (proposta) => {

    dialogControproposta.value = true;
    propostaSelected.value = proposta;
};

const clickRifiutaProposta = (id) => {

    emit('eliminaProposta', id);
};

const clickAccettaProposta = (idProposta) => {

    emit('accettaProposta', idProposta);
};

const controproposta = (idProposta, controproposta) => {

    dialogControproposta.value = false;
    emit('controproposta', idProposta, controproposta);
};

const controPropostaAbilitato = (proposta) => {

    if (proposta.controproposta === null) {

        return true;

    } else {

        return false;
    }

};

</script>
