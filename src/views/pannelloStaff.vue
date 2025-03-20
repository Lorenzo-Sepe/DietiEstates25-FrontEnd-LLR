<template>

    <Dialog v-model:visible="loadingOperazione" header="OPERAZIONE IN CORSO" :style="{ width: 'auto' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="card flex justify-center">
            <ProgressSpinner />
        </div>
    </Dialog>

    <Dialog v-model:visible="okAllert" header="CONFERMA OPERAZIONE" :style="{ width: 'auto' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <p class="m-0">
            Operzione conclusa con successo
        </p>
        <Button label="OK" @click="okAllert = false" />
    </Dialog>

    <Dialog v-model:visible="erroreAllert" header="ERRORE" :style="{ width: 'auto' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <p class="m-0">
           Errore di rete, riprovare più tardi.
        </p>
        <Button label="OK" @click="erroreAllert = false" />
    </Dialog>

    <div class="flex flex-col gap-4">
        <AreaSuperiore />
        <TabellaAnnunci :propAnnunci="annunci" :propLoading="loading" :propostaRequest="propostaRequest"
            @nuovaProposta="aggiungiPropostaManuale" @eliminaProposta="rifiutaProposta" />
        <div class="card">
            <Paginator :rows="5" :totalRecords="numeroAnnunci" @page="onPage"></Paginator>
        </div>
    </div>

</template>

<script setup>

import { ref, reactive, onMounted, } from 'vue';

import AreaSuperiore from '../components/PannelloStaff/AreaSuperiore.vue'
import TabellaAnnunci from '../components/PannelloStaff/tabellaAnnunci.vue'
import Paginator from 'primevue/paginator';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';


import AnnunciService from '../services/TabellaAnnunciService';
import PropostaService from '../services/PropostaService';
import { FiltroAnnuncioRequest } from '../dto/FiltroAnnunciRequest';
import { PropostaRequest } from '../dto/PropostaRequest';
import { useEmployeeStore } from '../stores/EmployeeStore';
import { Button } from 'primevue';

const numeroAnnunci = ref(0);
const annunci = ref([]);
const loading = ref(true);
const employeeStore = useEmployeeStore();
const okAllert = ref(false);
const erroreAllert = ref(false);
const loadingOperazione = ref(false);

const filtroAnnunci = reactive(new FiltroAnnuncioRequest());
const propostaRequest = reactive(new PropostaRequest());

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
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkaWV0aWVzdGF0ZXMyNSIsInN1YiI6ImFnZW50ZTEudGVzdEBhdjAuZGlldGllc3RhdGUuY29tIiwiaWF0IjoxNzQyNDk5ODI0LCJleHAiOjE3NDI1ODYyMjR9.Dtnk8MMtwHcBUcwnn2vG1V3zUxc8rZlCvnsxf2V9Cj8',
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

const aggiungiPropostaManuale = async () => {

    try {

        loadingOperazione.value = true;
        await AnnunciService.postPropostaManuale(propostaRequest);
        loadingOperazione.value = false;
        okAllert.value = true;

    } catch (error) {

        console.log("errore durante la chiamata axsios per la aggiunta proposta manuale: ", error);
        loadingOperazione.value = false;
        erroreAllert.value = true;
    }
}

const rifiutaProposta = async (idProposta) => {

    try {

        loadingOperazione.value = true;
        await PropostaService.deleteProposta(idProposta);
        loadingOperazione.value = false;
        changeStatoProposta(idProposta,'RIFIUTATO');
        okAllert.value = true;
        

    } catch (error) {

        console.log("errore durante la chiamata axsios per la eliminazione proposta: ", error);
        loadingOperazione.value = false;
        erroreAllert.value = true;
    }
}

const changeStatoProposta = (idProposta,stato) => {

    if(stato === 'RIFIUTATO'){

        annunci.value.forEach((annuncio) => {

            annuncio.proposte.forEach((proposta) => {

                if(proposta.idProposta === idProposta){

                    proposta.stato = 'RIFIUTATO';

                    return;
                }
            });
        });
    }
}


</script>