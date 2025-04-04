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


    <div class="w-full m-4">
        <Accordion v-model:activeIndex="activeIndex" :multiple="false" @update:activeIndex="onAccordionToggle"
            expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
            <AccordionPanel v-for="(agente, index) in employeeStore.dipedenti" :value="index">
                <AccordionHeader>
                    <span class="flex items-center gap-2 w-full">
                        <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                            shape="circle" />
                        <span class="font-bold whitespace-nowrap">{{ agente }}</span>
                    </span>
                </AccordionHeader>
                <AccordionContent>
                    <TabellaAnnunci :propAnnunci="annunci" :propLoading="loading" :propostaRequest="propostaRequest"
                        :agente="employeeStore.dipedenti" @nuovaProposta="aggiungiPropostaManuale"
                        @eliminaProposta="rifiutaProposta" @accettaProposta="accettaProposta"
                        @controproposta="controproposta" />
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, } from 'vue';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Avatar from 'primevue/avatar';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';

import TabellaAnnunci from '../components/PannelloStaff/tabellaAnnunci.vue'

import AnnunciService from '../services/TabellaAnnunciService';
import PropostaService from '../services/PropostaService';
import { FiltroAnnuncioRequest } from '../dto/FiltroAnnunciRequest';
import { PropostaRequest } from '../dto/PropostaRequest';
import { useEmployeeStore } from '../stores/EmployeeStore';
import { Button } from 'primevue';

const activeIndex = ref(null);
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

    employeeStore.aggiorna();

});

const onAccordionToggle = (newIndex) => {
    console.log("Indice attivato:", newIndex);
    const agenti = Array.from(employeeStore.dipedenti);
    if (newIndex !== null) {
        console.log("Dati utente:", agenti[newIndex]);
        filtroAnnunci.agenteCreatoreAnnuncio = agenti[newIndex];
        getAnnunci();
    }
}

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
