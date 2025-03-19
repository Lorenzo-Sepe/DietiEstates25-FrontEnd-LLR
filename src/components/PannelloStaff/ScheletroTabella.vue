
<template>
    <div class="card">
        <DataTable :value="products">
            <Column field="code" header="Titolo">
                <template #body>
                    <Skeleton></Skeleton>
                </template>
            </Column>
            <Column field="name" header="Copertina">
                <template #body>
                    <Skeleton></Skeleton>
                </template>
            </Column>
            <Column field="category" header="Prezzo">
                <template #body>
                    <Skeleton></Skeleton>
                </template>
            </Column>
            <Column field="quantity" header="Contratto">
                <template #body>
                    <Skeleton></Skeleton>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>

import { ref } from 'vue';

import Skeleton from 'primevue/skeleton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const products = ref(new Array(5));

</script>
