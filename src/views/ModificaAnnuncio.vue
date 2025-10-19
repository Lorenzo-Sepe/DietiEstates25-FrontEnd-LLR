<script setup>
import { reactive, ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

import Stepper from "primevue/stepper";
import StepList from "primevue/steplist";
import StepPanels from "primevue/steppanels";
import Step from "primevue/step";
import StepPanel from "primevue/steppanel";
import Divider from "primevue/divider";
import { modificaAnnuncio } from "../services/CreazioneModificaAnnunciService";
import StepDatiIniziali from "../components/CreaAnnuncio/StepDatiGenerali.vue";
import StepDatiPrincipali from "../components/CreaAnnuncio/StepDatiPrincipali.vue";
import StepIndirizzo from "../components/CreaAnnuncio/StepIndirizzo.vue";
import StepImmagini from "../components/CreaAnnuncio/StepCaricamentoImmagini.vue";
import Tag from "primevue/tag";
import Anteprima from "../components/CreaAnnuncio/Anteprima.vue";
import StepCaratteristiche from "../components/CreaAnnuncio/StepCaratteristiche.vue";
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';

import AnnunciImmobiliService from "../services/AnnunciImmobiliService";
import { AnnuncioImmobiliareRequest } from "../dto/RequestAnnuncio";
import { AnnuncioImmobiliareResponse } from "../dto/Response/AnnuncioImmobiliareResponse";
import CaricamentoDati from "../components/ModificaAnnuncio/CaricamentoDati.vue";


const route = useRoute();

const annuncio = ref(new AnnuncioImmobiliareRequest());
const annuncioResponse = ref(null);
const activeStep = ref(1);

const tentativoInvio = reactive({ valore: false });

const loading = ref(true);
const loadingComplete = ref(false);
const dialogCaricamento = ref(false);
const progressSpinner = ref(true);


onMounted(async () => {

    const response = await AnnunciImmobiliService.getAnnuncioImmobiliare(
        route.params.id,
    );

    annuncioResponse.value = new AnnuncioImmobiliareResponse(response);

    convertFromAnnuncioResponseToAnnuncioRequest(response);

    loading.value = false;

});

const vaiAvanti = () => {
    if (activeStep.value < 6) {
        activeStep.value++;
        window.scrollTo(0, 0);
    }
};

const vaiIndietro = () => {
    if (activeStep.value > 1) {
        activeStep.value--;
        window.scrollTo(0, 0);
    }
};

// Oggetto per contenere i riferimenti ai form
const step1 = ref({});
const step2 = ref({});
const step3 = ref({});
const step4 = ref({});


const inviaAnnuncio = async () => {

    tentativoInvio.valore = true;

    if (!step1.value.validaCampi()) {
        activeStep.value = 1;
        step2.value.validaCampi();
        step3.value.validaCampi();
        step4.value.validaCampi();
        return;
    } else if (!step2.value.validaCampi()) {
        activeStep.value = 2;
        step3.value.validaCampi();
        step4.value.validaCampi();
        return;
    } else if (!step3.value.validaCampi()) {
        activeStep.value = 3;
        step4.value.validaCampi();
        return;
    } else if (!step4.value.validaCampi()) {
        activeStep.value = 4;
        return;
    }

    dialogCaricamento.value = true;
    progressSpinner.value = true;

    try {

        await modificaAnnuncio(annuncio.value, route.params.id);

    } catch (error) {

        console.error("Errore durante la modifica dell'annuncio:", error);
    }

    progressSpinner.value = false;

};

watch(activeStep, (newVal) => {
    if (newVal > 1) {
        step1.value.validaCampi();
    }
    if (newVal > 2) {
        step2.value.validaCampi();
    }
});

const convertFromAnnuncioResponseToAnnuncioRequest = (response) => {

    annuncio.value.titolo = response.titolo;
    annuncio.value.descrizione = response.descrizione;
    annuncio.value.immobile = response.immobile;

    const immagini = annuncio.value.immobile.immagini;

    for (let i = 0; i < immagini.length; i++) {

        immagini[i].urlImmagineEsistente = immagini[i].url;
    }

    if (response.contratto.contrattoAffittoResponse != null) {

        const contrattoAffitto = {

            tipoDiContratto: response.contratto.tipoContratto,
            datiAffittoRequest: {

                tempoMinimo: response.contratto.contrattoAffittoResponse.tempoMinimo,
                tempoMassimo: response.contratto.contrattoAffittoResponse.tempoMassimo,
                caparra: response.contratto.contrattoAffittoResponse.caparra,
                prezzo: response.contratto.contrattoAffittoResponse.prezzoAffitto,
            }
        }

        annuncio.value.contratto = contrattoAffitto;

    } else {

        const contrattoVendita = {

            tipoDiContratto: response.contratto.tipoContratto,
            datiVenditaRequest: {

                prezzo: response.contratto.contrattoVenditaResponse.prezzoVendita,
                mutuoEstinto: response.contratto.contrattoVenditaResponse.mutuoEstinto,
            }
        }

        annuncio.value.contratto = contrattoVendita;
    }
}

const setLoadingCompete = (value) => {
    loadingComplete.value = value;
}

</script>

<template>


    <!--------------------------------------------------------------------------------------------------------------------------->

    <Dialog v-model:visible="dialogCaricamento" modal :closable="false"
        class="bg-green-50 border border-green-300 rounded-xl shadow animate-fade-in p-4">

        <div v-if="progressSpinner">
            <ProgressSpinner />
        </div>

        <div v-else class="flex flex-col items-center gap-3">
            <div class="flex items-center gap-2 text-green-700 text-lg font-semibold">
                <i class="pi pi-check-circle text-2xl"></i>
                <span>Modifica completata con successo!</span>
            </div>

            <Button label="OK" icon="pi pi-check" @click="dialogCaricamento = false"
                class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow" />
        </div>
    </Dialog>

    <!--------------------------------------------------------------------------------------------------------------------------->


    <CaricamentoDati v-if="!loadingComplete" @loadingComplete="setLoadingCompete(true)" />

    <div v-else class="flex flex-col gap-4 w-full items-center justify-center">
        <div
            class="justify-center border-1 border-green-300 rounded-lg p-2 bg-gray-100 my-2 mx-auto w-full md:w-3/4 lg:w-2/3 xl:w-3/4 2xl:w-4/5 flex">
            <Stepper v-model:value="activeStep" class="w-full max-w-full">
                <StepList>
                    <Step :value="1" :style="{
                        '--p-stepper-step-number-background': step1.hasErrori
                            ? '#ad0000'
                            : '',
                        '--p-stepper-step-number-color': step1.hasErrori ? 'white' : '',
                    }">
                        <i class="pi pi-home" />
                    </Step>
                    <Divider />
                    <Step :value="2" :style="{
                        '--p-stepper-step-number-background': step2.hasErrori
                            ? '#ad0000'
                            : '',
                        '--p-stepper-step-number-color': step2.hasErrori ? 'white' : '',
                    }">
                        <i class="pi pi-home" />
                    </Step>
                    <Divider />
                    <Step :value="3" :style="{
                        '--p-stepper-step-number-background': step3.hasErrori
                            ? '#ad0000'
                            : '',
                        '--p-stepper-step-number-color': step3.hasErrori ? 'white' : '',
                    }">
                        <i class="pi pi-map" />
                    </Step>
                    <Divider />
                    <Step :value="4" :style="{
                        '--p-stepper-step-number-background': step4.hasErrori
                            ? '#ad0000'
                            : '',
                        '--p-stepper-step-number-color': step4.hasErrori ? 'white' : '',
                    }"><i class="pi pi-map" /></Step>
                    <Divider />
                    <Step :value="5"><i class="pi pi-images" /></Step>
                    <Divider />
                    <Step :value="6"><i class="pi pi-images" /></Step>
                </StepList>

                <StepPanels>
                    <StepPanel class="!bg-gray-100" :value="1">
                        <Tag severity="secondary" class="my-4">
                            <h3>Annuncio: Informazioni di Base</h3>
                        </Tag>
                        <StepDatiIniziali class="" ref="step1" v-model:annuncio="annuncio"
                            :tentativoInvio="tentativoInvio.valore" @avanti="vaiAvanti" />
                    </StepPanel>

                    <StepPanel class="!bg-gray-100" :value="2">
                        <Tag severity="secondary" class="my-4">
                            <h3>Annuncio: Dettagli Annuncio</h3>
                        </Tag>
                        <StepDatiPrincipali ref="step2" v-model:annuncio="annuncio" @indietro="vaiIndietro"
                            @avanti="vaiAvanti" :tentativoInvio="tentativoInvio.valore" />
                    </StepPanel>
                    <StepPanel class="!bg-gray-100" :value="4">
                        <Tag severity="secondary" class="my-4">
                            <h3>Annuncio: Indirizzo e Posizione</h3>
                        </Tag>
                        <StepIndirizzo ref="step4" :tentativoInvio="tentativoInvio.valore" :activeStep="activeStep"
                            v-model:annuncio="annuncio" @indietro="vaiIndietro" @avanti="vaiAvanti" />
                    </StepPanel>
                    <StepPanel class="!bg-gray-100" :value="3">
                        <Tag severity="secondary" class="my-4">
                            <h3>Annuncio: Caratteristiche</h3>
                        </Tag>
                        <StepCaratteristiche ref="step3" v-model:annuncio="annuncio" @indietro="vaiIndietro"
                            @avanti="vaiAvanti" :tentativoInvio="tentativoInvio.valore" />
                    </StepPanel>
                    <StepPanel class="!bg-gray-100" :value="5">
                        <Tag severity="secondary" class="my-4">
                            <h3>Annuncio: Caricamento Immagini</h3>
                        </Tag>
                        <StepImmagini v-model:annuncio="annuncio" @indietro="vaiIndietro" @avanti="vaiAvanti" />
                    </StepPanel>
                    <StepPanel class="!bg-gray-100" :value="6">
                        <Tag severity="secondary" class="my-4">
                            <h3>Annuncio: Anteprima</h3>
                        </Tag>
                        <Anteprima v-model:annuncio="annuncio" :isModifica="true" @indietro="vaiIndietro"
                            @invia="inviaAnnuncio" />
                    </StepPanel>
                </StepPanels>
            </Stepper>
        </div>
    </div>
</template>

<style>
.p-fluid {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.error-message {
    color: red;
    font-weight: bold;
}
</style>
