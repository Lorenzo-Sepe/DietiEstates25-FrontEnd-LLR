<template>

    <ScheletroTabella v-if="props.propLoading" />

    <div class="card" v-else>
        <DataTable v-model:expandedRows="expandedRows" :value="props.propAnnunci" dataKey="id"
            tableStyle="min-width: 60rem">
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
                                <img src="../../assets/Icon/modificaAnnuncio.png" class="w-5 h-5" />
                            </template>
                        </Button>
                        <Button variant="text" rounded aria-label="Filter"
                            v-tooltip="{ value: 'Elimina annuncio', showDelay: 300, hideDelay: 300 }">
                            <template #icon>
                                <img src="../../assets/Icon/eliminaAnnuncio.png" class="w-5 h-5" />
                            </template>
                        </Button>
                    </div>
                </template>
            </Column>
            <template #expansion="slotProps">

                <div class="bg-gray-100">

                    <div class="intestazione-proposte flex items-center justify-center p-4 gap-16">
                        <h2>Gestione proposte</h2>
                        <Button v-if="props.isAgente" label="Aggiungi proposta manuale"
                            @click="clickAggiungiPropostaManuale(slotProps.data.id)"></Button>
                    </div>

                    <div class="card flex justify-center">
                        <Dialog v-model:visible="visible" :style="{ width: 'auto' }" header="Form proposta"
                            :modal="true">
                            <AggiungiPropostaManuale :propostaRequest="props.propostaRequest"
                                :idAnnuncio="selectedAnnuncioId" @nuovaProposta="nuovaProposta" />
                        </Dialog>
                    </div>

                    <div class="card flex justify-center">
                        <Dialog v-model:visible="dialogControproposta" :style="{ width: 'auto' }"
                            header="Form controproposta" :modal="true">
                            <FormControproposta :proposta="propostaSelected" @controproposta="controproposta" />
                        </Dialog>
                    </div>

                    <div class="p-4">
                        <Tag :value="'Proposte in trattative'" :severity="'warn'" />
                        <DataTable :value="filterProposteInTrattativa(slotProps.data.proposte)">
                            <Column field="datiProponente.nome" header="Nome" sortable></Column>
                            <Column field="datiProponente.cognome" header="Cognome" sortable></Column>
                            <Column field="datiProponente.email" header="Email" sortable></Column>
                            <Column field="prezzoProposta" header="Proposta" sortable>
                                <template #body="slotProps">
                                    <span :class="{ 'line-through': slotProps.data.controproposta !== null }">
                                        {{ slotProps.data.prezzoProposta }}
                                    </span>
                                </template>
                            </Column>
                            <Column field="controproposta" header="Controproposta" sortable></Column>
                            <Column headerStyle="width:4rem">
                                <template #body="slotProps">
                                    <div class="flex flex-row gap-2">
                                        <Button v-if="props.isAgente" variant="text" rounded aria-label="Filter"
                                            class="hover:bg-[#008000]/60!"
                                            @click="clickAccettaProposta(slotProps.data.idProposta)"
                                            v-tooltip="{ value: 'Accetta la proposta', showDelay: 300, hideDelay: 300 }">
                                            <template #icon>
                                                <img src="../../assets/Icon/accettaProposta.png" class="w-5 h-5" />
                                            </template>
                                        </Button>
                                        <Button v-if="props.isAgente" variant="text" rounded aria-label="Filter"
                                            class="hover:bg-[#FFA500]/60!"
                                            v-tooltip="{ value: 'Fai una controproposta', showDelay: 300, hideDelay: 300 }"
                                            @click="clickControproposta(slotProps.data)">
                                            <template #icon>
                                                <img src="../../assets/Icon/controproposta.png" class="w-5 h-5" />
                                            </template>
                                        </Button>
                                        <Button v-if="props.isAgent" variant="text" rounded aria-label="Filter"
                                            class="hover:bg-[#FF0000]/60!"
                                            v-tooltip="{ value: 'Rifiuta proposta', showDelay: 300, hideDelay: 300 }"
                                            @click="clickRifiutaProposta(slotProps.data.idProposta)">
                                            <template #icon>
                                                <img src="../../assets/Icon/rifiutaProposta.png" class="w-5 h-5" />
                                            </template>
                                        </Button>
                                    </div>
                                </template>
                            </Column>
                        </DataTable>
                    </div>

                    <div class="p-4">
                        <Tag :value="'Proposte accettate'" :severity="'success'" />
                        <DataTable :value="filterProposteAccettate(slotProps.data.proposte)">
                            <Column field="datiProponente.nome" header="Nome" sortable></Column>
                            <Column field="datiProponente.cognome" header="Cognome" sortable></Column>
                            <Column field="datiProponente.email" header="Email" sortable></Column>
                            <Column field="prezzoProposta" header="Proposta" sortable></Column>
                            <Column field="controproposta" header="Controproposta" sortable></Column>
                        </DataTable>
                    </div>

                    <div class="p-4">
                        <Tag :value="'Proposte rifutate'" :severity="'danger'" />
                        <DataTable :value="filterProposteRifiutate(slotProps.data.proposte)">
                            <Column field="datiProponente.nome" header="Nome" sortable></Column>
                            <Column field="datiProponente.cognome" header="Cognome" sortable></Column>
                            <Column field="datiProponente.email" header="Email" sortable></Column>
                            <Column field="prezzoProposta" header="Proposta" sortable></Column>
                            <Column field="controproposta" header="Controproposta" sortable></Column>
                        </DataTable>
                    </div>

                </div>

            </template>
        </DataTable>
        <Toast />
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ScheletroTabella from '../PannelloStaff/ScheletroTabella.vue';
import AggiungiPropostaManuale from '../PannelloStaff/AggiungiPropostaManuale.vue';
import Dialog from 'primevue/dialog';
import FormControproposta from '../PannelloStaff/FormControproposta.vue';


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
