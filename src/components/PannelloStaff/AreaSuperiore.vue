<template>

    <div class="contenitore-area-superiore">
        <div class="contenitore-foto-profilo flex items-center gap-4">
            <Avatar :image="employeeStore.employee.urlFotoProfilo" size="xlarge"
                shape="circle" />
            <div class="info-profilo flex flex-col">
                <p>Agente: <b>{{ employeeStore.employee.name }}  {{ employeeStore.employee.surname }} </b> </p>
                <p>Nome agenzia</p>
            </div>
        </div>
        <div class="titolo-pagina">
            <h1>Gestione annunci immobiliari</h1>
        </div>
    </div>

</template>

<script setup>

import Avatar from 'primevue/avatar';
import { useEmployeeStore } from '../../stores/EmployeeStore';

const employeeStore = useEmployeeStore();

</script>

<style scoped>
.contenitore-area-superiore {

    display: flex;
    flex-direction: row;
    gap: 6rem;
    padding: 1rem;
}
</style>