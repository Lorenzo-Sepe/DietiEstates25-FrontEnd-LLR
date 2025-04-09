<template>

    <div class="contenitore-area-superiore items-center flex flex-row">
        <div class="contenitore-foto-profilo flex items-start gap-4">
            <Avatar :image="employeeStore.UrlFotoProfilo" size="xlarge"
                shape="circle" />
            <div class="info-profilo flex flex-col">
                <p>Agente: <b>{{ employeeStore.employee.datiImpiegato.nome }}  {{ employeeStore.employee.datiImpiegato.cognome }} </b> </p>
                <p>{{ employeeStore.employee.DatiAgenziaImmobiliare.nomeAzienda }}</p>
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