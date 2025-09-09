<template>

    <div class="card">
        <DataTable :value="products">
            <Column field="dataRicerca" header="Data Ricerca">
                <template #body>
                    <Skeleton></Skeleton>
                </template>
            </Column>
            <Column field="comune" header="Comune">
                <template #body>
                    <Skeleton></Skeleton>
                </template>
            </Column>
            <Column field="tipologiaImmobile" header="Tipologia">
                <template #body>
                    <Skeleton></Skeleton>
                </template>
            </Column>
            <Column field="tipologiaContratto" header="Contratto">
                <template #body>
                    <Skeleton></Skeleton>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, defineProps} from 'vue';

import Skeleton from 'primevue/skeleton';
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const products = ref(new Array(8));

</script>
