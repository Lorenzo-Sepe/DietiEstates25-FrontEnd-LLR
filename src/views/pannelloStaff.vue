<template>

<!----------------------------------------------  SEZIONE DIALOG PER GLI ALLERT ------------------------------------------------>
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

    <!------------------------------------------------------------------------ ------------------------------------------------>

    <div class="flex flex-col gap-4 w-full p-2">
        <AreaSuperiore />
        <div class="w-full">
            <TabellaAnnunci :propAnnunci="annunci" :propLoading="loading" :propostaRequest="propostaRequest"
                @nuovaProposta="aggiungiPropostaManuale" 
                @eliminaProposta="rifiutaProposta"
                @accettaProposta="accettaProposta"
                @controproposta="controproposta" />
        </div>
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
        urlFotoProfilo: 'https://dieti24.blob.core.windows.net/upload/annuncio8-0-2025-03-05.png',
        email: 'agente1.test@av0.dietiestate.com',
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkaWV0aWVzdGF0ZXMyNSIsInN1YiI6ImFnZW50ZTEuZGkgcm9ieWltbW9iaWxlQHJvYnlpbW1vYmlsaS5kaWV0aWVzdGF0ZS5jb20iLCJpYXQiOjE3NDM0Mzc0MzgsImV4cCI6MTc0MzUyMzgzOH0.LbJVDt_S8AmHZcLp-BRXM0VgjCL342hyNxFyt7-ef0k',
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
        const nuovaProposta = await AnnunciService.postPropostaManuale(propostaRequest);
        loadingOperazione.value = false;
        aggiungiProposta(nuovaProposta.idProposta);
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
        await PropostaService.rifiutaProposta(idProposta);
        loadingOperazione.value = false;
        changeStatoProposta(idProposta, 'RIFIUTATO');
        okAllert.value = true;


    } catch (error) {

        console.log("errore durante la chiamata axsios per la eliminazione proposta: ", error);
        loadingOperazione.value = false;
        erroreAllert.value = true;
    }
}

const changeStatoProposta = (idProposta, stato) => {

    if (stato === 'RIFIUTATO') {

        annunci.value.forEach((annuncio) => {

            annuncio.proposte.forEach((proposta) => {

                if (proposta.idProposta === idProposta) {

                    proposta.stato = 'RIFIUTATO';

                    return;
                }
            });
        });
    } else if (stato === 'ACCETTATO') {

        annunci.value.forEach((annuncio) => {

            annuncio.proposte.forEach((proposta) => {

                if (proposta.idProposta === idProposta) {

                    proposta.stato = 'ACCETTATO';

                    return;
                }
            });
        });
    }
}

const aggiungiProposta = (idProposta) => {

    annunci.value.forEach((annuncio) => {


        if (annuncio.id === propostaRequest.annuncioId) {

            annuncio.proposte.push({

                idProposta: idProposta,
                prezzoProposta: propostaRequest.prezzo,
                stato: 'IN_TRATTAZIONE',
                controproposta: null,
                datiProponente: {

                    nome: propostaRequest.nome,
                    cognome: propostaRequest.cognome,
                    tipoContatto: propostaRequest.tipoContatto,
                    contatto: propostaRequest.informazioniContatto
                }


            });

            return;
        }
    });
}

const accettaProposta = async (idProposta) => {

    try {

        loadingOperazione.value = true;
        await PropostaService.accettaProposta(idProposta);
        loadingOperazione.value = false;
        changeStatoProposta(idProposta, 'ACCETTATO');
        okAllert.value = true;

    } catch (error) {

        console.log("errore durante la chiamata axsios per la accettazione proposta: ", error);
        loadingOperazione.value = false;
        erroreAllert.value = true;
    }
}

const controproposta = async (idProposta, prezzoControproposta) => {

    try {

        loadingOperazione.value = true;
        await PropostaService.controproposta(idProposta, prezzoControproposta);
        loadingOperazione.value = false;
        changeControposta(idProposta, prezzoControproposta);
        okAllert.value = true;

    } catch (error) {

        console.log("errore durante la chiamata axsios per la controproposta proposta: ", error);
        loadingOperazione.value = false;
        erroreAllert.value = true;
    }
}

const changeControposta = (idProposta, prezzoControproposta) => {

    annunci.value.forEach((annuncio) => {

        annuncio.proposte.forEach((proposta) => {

            if (proposta.idProposta === idProposta) {

                proposta.controproposta = prezzoControproposta;

                return;
            }
        });
    });
}

</script>