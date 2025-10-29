<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from 'vue-router'

import Stepper from "primevue/stepper";
import StepList from "primevue/steplist";
import StepPanels from "primevue/steppanels";
import Step from "primevue/step";
import StepPanel from "primevue/steppanel";
import Divider from "primevue/divider";
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import ProgressBar from 'primevue/progressbar';
import Button from 'primevue/button';

import { CreaAnnuncio } from "../services/CreazioneModificaAnnunciService";
import { AnnuncioImmobiliareRequest } from "../dto/RequestAnnuncio";


import StepDatiIniziali from "../components/CreaAnnuncio/StepDatiGenerali.vue";
import StepDatiPrincipali from "../components/CreaAnnuncio/StepDatiPrincipali.vue";
import StepIndirizzo from "../components/CreaAnnuncio/StepIndirizzo.vue";
import StepImmagini from "../components/CreaAnnuncio/StepCaricamentoImmagini.vue";
import { useStoreAnnuncio } from "../stores/CreazioneAnnuncioStore";
import Anteprima from "../components/CreaAnnuncio/Anteprima.vue";
import StepCaratteristiche from "../components/CreaAnnuncio/StepCaratteristiche.vue";

const router = useRouter()

const storeAnnuncio = useStoreAnnuncio();

const annuncio = ref(new AnnuncioImmobiliareRequest());
const activeStep = ref(1);

const tentativoInvio = reactive({ valore: false });

const dialogCaricamento = ref(false);
const dialogAnnuncioSospeso = ref(false);
const dialogCaricamentoDati = ref(false);
const progressSpinner = ref(true);
const isSuccess = ref(false);
const isError = ref(false);

const valoreCaricamento = ref(0);
const interval = ref();

const idAnnuncioCreato = ref(null);

onMounted(() => {

  if (!storeAnnuncio.isAnnuncioVuoto) {

    dialogAnnuncioSospeso.value = true;

  } else {

    annuncio.value = storeAnnuncio.annuncio;
  }
})

const gestisciAnnuncioSospeso = (isNuovo) => {

  dialogAnnuncioSospeso.value = false;

  if (isNuovo) {

    storeAnnuncio.resetAnnuncio();

    annuncio.value = storeAnnuncio.annuncio;

    dialogAnnuncioSospeso.value = false;

  } else {

    dialogCaricamentoDati.value = true;

    interval.value = setInterval(() => {

      let newValue = valoreCaricamento.value + Math.floor(Math.random() * 50) + 1;

      if (newValue >= 100) {
        newValue = 100;
        clearInterval(interval.value);
        interval.value = null;
        annuncio.value = storeAnnuncio.annuncio;
        dialogCaricamentoDati.value = false;
      }

      valoreCaricamento.value = newValue;

    }, 1000);

  }

}

const vaiAvanti = () => {
  if (activeStep.value < 6) activeStep.value++;
};

const vaiIndietro = () => {
  if (activeStep.value > 1) activeStep.value--;
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
  isSuccess.value = false;
  isError.value = false;

  try {

    idAnnuncioCreato.value = await CreaAnnuncio(annuncio);

  } catch (error) {
    console.error("Errore durante la creazione dell'annuncio:", error);
    progressSpinner.value = false;
    isError.value = true;
    return;
  }

  progressSpinner.value = false;
  isSuccess.value = true;

};

watch(activeStep, (newVal) => {
  if (newVal > 1) {
    step1.value.validaCampi();
  }
  if (newVal > 2) {
    step2.value.validaCampi();
  }

});
</script>

<template>


  <!----------------------------------------------------DIALOGs----------------------------------------------------->

  <Dialog v-model:visible="dialogCaricamento" modal :closable="false"
    class="bg-white border border-gray-200 rounded-2xl shadow-lg animate-fade-in w-[420px] max-w-[90vw] p-6 overflow-hidden">
    <!-- Stato: Caricamento -->
    <div v-if="progressSpinner" class="flex flex-col items-center gap-4 text-center">
      <ProgressSpinner />
      <div class="text-gray-700">
        <div class="text-lg font-semibold">Invio annuncio in corso...</div>
        <div class="text-sm text-gray-600 mt-1">
          Stiamo salvando i dati e caricando le immagini.<br />
          Potrebbe richiedere qualche secondo, non chiudere questa finestra.
        </div>
      </div>
    </div>

    <!-- Stato: Successo -->
    <div v-if="isSuccess" class="flex flex-col items-center gap-4 text-center">
      <div class="flex items-center gap-2 text-green-700 text-lg font-semibold">
        <i class="pi pi-check-circle text-3xl"></i>
        <span>Annuncio salvato con successo!</span>
      </div>
      <div class="text-gray-600 text-sm">
        Tutti i dati e le immagini sono stati caricati correttamente.
      </div>
      <div class="flex flex-wrap justify-center gap-3 mt-2 w-full">
        <Button label="Torna al portale" icon="pi pi-arrow-left"
          @click="dialogCaricamento = false; router.push('/PortaleAgenzia')"
          class="flex-1 min-w-[160px] bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg shadow text-nowrap" />
        <Button label="Visualizza annuncio" icon="pi pi-eye"
          @click="dialogCaricamento = false; router.push('/annuncio/' + idAnnuncioCreato);"
          class="flex-1 min-w-[160px] bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow text-nowrap" />
      </div>
    </div>

    <!-- Stato: Errore -->
    <div v-if="isError" class="flex flex-col gap-4 text-left">
      <div class="flex items-start gap-3 text-red-700 text-lg font-semibold">
        <i class="pi pi-times-circle text-3xl leading-none mt-1"></i>
        <span>Errore durante il salvataggio dell’annuncio</span>
      </div>
      <div class="text-gray-700 text-sm leading-relaxed">
        Si è verificato un problema durante il caricamento dei dati o delle immagini.
        Ti consigliamo di:
        <ul class="list-disc list-inside mt-2 text-gray-600">
          <li>Verificare la connessione internet</li>
          <li>Riprovare tra qualche istante</li>
        </ul>
        Se l’errore persiste, contatta il supporto tecnico per assistenza.
      </div>
      <div class="flex justify-center mt-2">
        <Button label="Riprova" icon="pi pi-refresh" @click="inviaAnnuncio()"
          class="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow text-nowrap" />
      </div>
    </div>
  </Dialog>

  <Dialog v-model:visible="dialogAnnuncioSospeso" modal :closable="false"
    class="bg-white border border-gray-200 rounded-2xl shadow-lg animate-fade-in w-[420px] max-w-[90vw] p-6 overflow-hidden">

    <!-- 🔹 Header personalizzato -->
    <template #header>
      <div class="flex items-center gap-2">
        <i class="pi pi-exclamation-triangle text-yellow-500 text-xl"></i>
        <span class="text-black font-bold text-lg">ATTENZIONE</span>
      </div>
    </template>

    <p>È stato rilevato un annuncio in sospeso. Vuoi ripristinare i dati oppure creare un nuovo annuncio? </p>

    <div class="flex justify-end gap-2 my-4">
      <Button label="Nuovo annuncio" severity="secondary" raised @click="gestisciAnnuncioSospeso(true)" />
      <Button label="Ripristina Annuncio" severity="success" raised @click="gestisciAnnuncioSospeso(false)" />
    </div>

  </Dialog>

  <Dialog v-model:visible="dialogCaricamentoDati" :closable="false" :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div class="card">
      <ProgressBar :value="valoreCaricamento" />
    </div>
    <p>Caricamento dati in corso...</p>
  </Dialog>

  <!--------------------------------------------------------------------------------------------------------------------------->

  <div class="flex flex-col gap-4 w-full mx-3 items-center justify-center">
    <h1 class="my-4 mx-4">CREAZIONE NUOVO ANNUNCIO</h1>

    <div class="justify-center border-1 border-green-300 rounded-lg p-2 bg-gray-100 my-2 mx-auto w-full flex">
      <Stepper v-model:value="activeStep" class="w-full max-w-full">
        <StepList>
          <Step :value="1" :style="{
            '--p-stepper-step-number-background': step1.hasErrori
              ? '#ad0000'
              : '',
            '--p-stepper-step-number-color': step1.hasErrori ? 'white' : '',
          }">
            <i class="pi pi-building" />
          </Step>
          <Divider />
          <Step :value="2" :style="{
            '--p-stepper-step-number-background': step2.hasErrori
              ? '#ad0000'
              : '',
            '--p-stepper-step-number-color': step2.hasErrori ? 'white' : '',
          }">
            <i class="pi pi-file-edit" />
          </Step>
          <Divider />
          <Step :value="3" :style="{
            '--p-stepper-step-number-background': step3.hasErrori
              ? '#ad0000'
              : '',
            '--p-stepper-step-number-color': step3.hasErrori ? 'white' : '',
          }">
            <i class="pi pi-tags" />
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
          <Step :value="6"><i class="pi pi-file-check" /></Step>
        </StepList>

        <StepPanels>
          <StepPanel class="!bg-gray-100" :value="1">
            <h3>Informazioni di Base</h3>
            <StepDatiIniziali class="" ref="step1" v-model:annuncio="annuncio" :tentativoInvio="tentativoInvio.valore"
              @avanti="vaiAvanti" />
          </StepPanel>

          <StepPanel class="!bg-gray-100" :value="2">
            <h3>Dettagli Annuncio</h3>
            <StepDatiPrincipali ref="step2" v-model:annuncio="annuncio" @indietro="vaiIndietro" @avanti="vaiAvanti"
              :tentativoInvio="tentativoInvio.valore" />
          </StepPanel>
          <StepPanel class="!bg-gray-100" :value="4">
            <h3>Indirizzo e Posizione</h3>
            <StepIndirizzo ref="step4" :tentativoInvio="tentativoInvio.valore" :activeStep="activeStep"
              v-model:annuncio="annuncio" @indietro="vaiIndietro" @avanti="vaiAvanti" />
          </StepPanel>
          <StepPanel class="!bg-gray-100" :value="3">
            <h3>Caratteristiche</h3>
            <StepCaratteristiche ref="step3" v-model:annuncio="annuncio" @indietro="vaiIndietro" @avanti="vaiAvanti"
              :tentativoInvio="tentativoInvio.valore" />
          </StepPanel>
          <StepPanel class="!bg-gray-100" :value="5">
            <StepImmagini v-model:annuncio="annuncio" @indietro="vaiIndietro" @avanti="vaiAvanti" />
          </StepPanel>
          <StepPanel class="!bg-gray-100" :value="6">
            <Anteprima v-model:annuncio="annuncio" @indietro="vaiIndietro" clearable @invia="inviaAnnuncio" />
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

.primeTags {
  margin-block: calc(var(--spacing) * 2)
    /* 1rem = 16px */
  ;
  width: calc(1 / 2 * 100%)
    /* 50% */
  ;
  text-align: center;
}
</style>
