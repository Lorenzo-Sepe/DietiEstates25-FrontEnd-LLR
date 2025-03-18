<template>

    <ScheletroTabella v-if="loading" />

    <div class="card" v-else>
        <DataTable :value="annunci" dataKey="id" tableStyle="min-width: 60rem">
            <template #header>
                <div class="flex flex-wrap justify-end gap-2">
                    <Button label="Aggiungi annuncio immobilare" />
                </div>
            </template>
            <Column expander style="width: 5rem" />
            <Column field="titolo" header="Titolo"></Column>
            <Column header="Copertina">
                <template #body="slotProps">
                    <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
                        :alt="slotProps.data.image" class="shadow-lg" width="64" />
                </template>
            </Column>
            <Column field="price" header="Prezzo"></Column>
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
                    <h5>Proposte ricevute di {{ slotProps.data.name }}</h5>
                    <Button label="Aggiungi proposta manuale"></Button>
                    <DataTable :value="slotProps.data.orders">
                        <Column field="id" header="Nome" sortable></Column>
                        <Column field="customer" header="Email" sortable></Column>
                        <Column field="date" header="Proposta" sortable></Column>
                        <Column field="amount" header="Controproposta" sortable></Column>
                        <Column field="status" header="Stato" sortable>
                            <template #body="slotProps">
                                <Tag :value="slotProps.data.status.toLowerCase()"
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
import AnnunciService from '../../services/TabellaAnnunciService';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ScheletroTabella from '../PannelloStaff/ScheletroTabella.vue';

import { useEmployeeStore } from '../../stores/EmployeeStore';
import { FiltroAnnunciRequest } from '../../dto/FiltroAnnunciRequest'

const annunci = ref([]);
const employeeStore = useEmployeeStore();
const loading = ref(true);

onMounted(async () => {

    // Creare una nuova richiesta utilizzando il builder
    const filtroAnnunci = FiltroAnnunciRequest.builder()
        .setNumeroPagina(1)             // Impostare il numero della pagina
        .setNumeroDiElementiPerPagina(5) // Impostare il numero di elementi per pagina
        .build();                        // Creare l'oggetto finale

    // Ora `filtroAnnunci` è un'istanza di `FiltroAnnunciRequest` con i valori impostati
    console.log("filtroooo:", filtroAnnunci);

    employeeStore.initializeStore()

    const employStruct = {

        id: 4,
        username: 'agente1.test@av0.dietiestate.com"',
        name: 'Roberto',
        surname: 'Spena',
        urlFotoProfilo: '',
        email: 'agente1.test@av0.dietiestate.com',
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkaWV0aWVzdGF0ZXMyNSIsInN1YiI6ImFnZW50ZTEudGVzdEBhdjAuZGlldGllc3RhdGUuY29tIiwiaWF0IjoxNzQyMjk3NTc5LCJleHAiOjE3NDIzODM5Nzl9.bCmk9bOnTro52FIDHJ31KG2UXcFC4WynT9U_a7uSRNU',
        authority: 'AGENT',
        isAuthenticated: true
    }

    employeeStore.setEmployee(employStruct);

    console.log("storee:", employeeStore.getEmployeeData);

    try {

        annunci.value = await AnnunciService.getAnnunciByStaff(filtroAnnunci);

    } catch (error) {

        console.log("errore durante la chiamata axsios: ", error);

    }finally{

        loading.value = false;
    }
});



const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const getOrderSeverity = (order) => {
    switch (order.status) {
        case 'DELIVERED':
            return 'success';

        case 'CANCELLED':
            return 'danger';

        case 'PENDING':
            return 'warn';

        case 'RETURNED':
            return 'info';

        default:
            return null;
    }
};

</script>
