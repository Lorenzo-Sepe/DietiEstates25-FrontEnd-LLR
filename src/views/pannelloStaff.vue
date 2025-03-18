<template>
    <div class="flex flex-col gap-4">
        <AreaSuperiore />
        <TabellaAnnunci :propAnnunci="annunci" :propLoading="loading" />
        <div class="card">
            <Paginator :rows="5" :totalRecords="numeroAnnunci" @page="onPage"></Paginator>
        </div>
    </div>
</template>

<script setup>

import { ref, reactive, onMounted } from 'vue';

import AreaSuperiore from '../components/PannelloStaff/AreaSuperiore.vue'
import TabellaAnnunci from '../components/PannelloStaff/tabellaAnnunci.vue'
import Paginator from 'primevue/paginator';

import AnnunciService from '../services/TabellaAnnunciService';
import { FiltroAnnuncioRequest } from '../dto/FiltroAnnunciRequest';
import { useEmployeeStore } from '../stores/EmployeeStore';

const numeroAnnunci = ref(0);
const annunci = ref([]);
const loading = ref(true);
const employeeStore = useEmployeeStore();

const filtroAnnunci = reactive(new FiltroAnnuncioRequest());

onMounted(async () => {

    filtroAnnunci.numeroPagina = 1;
    filtroAnnunci.numeroDiElementiPerPagina = 5;

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

    getNumeroAnnunci();
    getAnnunci();

})

const onPage = (event) => {

    filtroAnnunci.numeroPagina = event.page + 1;
    getAnnunci();
};

const getNumeroAnnunci = async () => {

    try {

        numeroAnnunci.value = await AnnunciService.getNumeroAnnunciByStaff();
        console.log("numero annunci:", numeroAnnunci.value);

    } catch (error) {

        console.log("errore durante la chiamata axsios per la get numero annunci: ", error);
    }
}

const getAnnunci = async () => {

    try {

        loading.value = true;
        annunci.value = await AnnunciService.getAnnunciByStaff(filtroAnnunci);

    } catch (error) {

        console.log("errore durante la chiamata axsios per la get annunci: ", error);

    } finally {

        loading.value = false;
        console.log("annunci:", annunci.value);
    }
}

</script>