<template>

    <ScheletroTabella v-if="props.propLoading" />

    <div class="card" v-else>
        <DataTable v-model:expandedRows="expandedRows" :value="props.propAnnunci" dataKey="id" tableStyle="min-width: 60rem">
            <template #header>
                <div class="flex flex-wrap justify-end gap-2">
                    <Button label="Aggiungi annuncio immobilare" />
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
                        <Button v-tooltip="{ value: 'Modifica annuncio', showDelay: 1000, hideDelay: 300 }">
                            <template #icon>
                                <img src="../../assets/Icon/controproposta.png" class="w-5 h-5" />
                            </template>
                        </Button>
                        <Button v-tooltip="{ value: 'Elimina annuncio', showDelay: 1000, hideDelay: 300 }">
                            <template #icon>
                                <img src="../../assets/Icon/rifiutaProposta.png" class="w-5 h-5" />
                            </template>
                        </Button>
                    </div>
                </template>
            </Column>
            <template #expansion="slotProps">
                <div class="p-4">
                    <h5>Proposte ricevute di {{ slotProps.data.titolo }}</h5>
                    <Button label="Aggiungi proposta manuale"></Button>
                    <DataTable :value="slotProps.data.proposte">
                        <Column field="datiProponente.nome" header="Nome" sortable></Column>
                        <Column field="datiProponente.email" header="Email" sortable></Column>
                        <Column field="prezzoProposta" header="Proposta" sortable></Column>
                        <Column field="controproposta" header="Controproposta" sortable></Column>
                        <Column field="stato" header="Stato" sortable>
                            <template #body="slotProps">
                                <Tag :value="slotProps.data.stato.toLowerCase()"
                                    :severity="getOrderSeverity(slotProps.data)" />
                            </template>
                        </Column>
                        <Column headerStyle="width:4rem">
                            <template #body>
                                <div class="flex flex-row gap-2">
                                    <Button
                                        v-tooltip="{ value: 'Accetta la proposta', showDelay: 1000, hideDelay: 300 }">
                                        <template #icon>
                                            <img src="../../assets/Icon/accettaProposta.png" class="w-5 h-5" />
                                        </template>
                                    </Button>
                                    <Button
                                        v-tooltip="{ value: 'Fai una controproposta', showDelay: 1000, hideDelay: 300 }">
                                        <template #icon>
                                            <img src="../../assets/Icon/controproposta.png" class="w-5 h-5" />
                                        </template>
                                    </Button>
                                    <Button v-tooltip="{ value: 'Rifiuta proposta', showDelay: 1000, hideDelay: 300 }">
                                        <template #icon>
                                            <img src="../../assets/Icon/rifiutaProposta.png" class="w-5 h-5" />
                                        </template>
                                    </Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
        <Toast />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ScheletroTabella from '../PannelloStaff/ScheletroTabella.vue';

const props = defineProps(['propAnnunci', 'propLoading']);
const expandedRows = ref([])


onMounted(async () => {
});


const getOrderSeverity = (proposta) => {

    switch (proposta.stato) {
        case 'ACCETTATO':
            return 'success';

        case 'RIFIUTATO':
            return 'danger';

        case 'IN_TRATTAZIONE':
            return 'warn';

        case 'RETURNED':
            return 'info';

        default:
            return null;
    }
};

</script>
