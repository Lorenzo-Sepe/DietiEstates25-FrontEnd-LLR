
<template>
    <div class="card">
        <DataTable v-model:selection="selectedProduct" :value="products" selectionMode="single" dataKey="id" :metaKeySelection="false"
                @rowSelect="onRowSelect" @rowUnselect="onRowUnselect" tableStyle="min-width: 50rem">
            <Column field="code" header="Code"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="category" header="Category"></Column>
            <Column field="quantity" header="Quantity"></Column>
        </DataTable>
        <Toast/>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { ProductService } from '../../service/ProposteService';

onMounted(() => {
    ProductService.getProductsMini().then((data) => (products.value = data));
});

const products = ref();
const selectedProduct = ref();
const toast = useToast();
const onRowSelect = (event) => {
    toast.add({ severity: 'info', summary: 'Product Selected', detail: 'Name: ' + event.data.name, life: 3000 });
};
const onRowUnselect = (event) => {
    toast.add({ severity: 'warn', summary: 'Product Unselected', detail: 'Name: ' + event.data.name, life: 3000 });
}

</script>
