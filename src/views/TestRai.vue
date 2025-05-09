<script setup>
import { reactive, ref, watch } from "vue";
import Stepper from "primevue/stepper";
import StepList from "primevue/steplist";
import StepPanels from "primevue/steppanels";
import Step from "primevue/step";
import StepPanel from "primevue/steppanel";
import Divider from "primevue/divider";
import { CreaAnnuncio } from "../services/CreazioneModificaAnnunciService";
import StepDatiIniziali from "../components/CreaAnnuncio/StepDatiGenerali.vue";
import StepDatiPrincipali from "../components/CreaAnnuncio/StepDatiPrincipali.vue";
import StepIndirizzo from "../components/CreaAnnuncio/StepIndirizzo.vue";
import StepImmagini from "../components/CreaAnnuncio/StepCaricamentoImmagini.vue";
import { useStoreAnnuncio } from "../stores/CreazioneAnnuncioStore";
import { Button } from "primevue";
import Tag from "primevue/tag";
import Anteprima from "../components/CreaAnnuncio/Anteprima.vue";
import StepCaratteristiche from "../components/CreaAnnuncio/StepCaratteristiche.vue";
const storeAnnuncio = useStoreAnnuncio();

const annuncio = storeAnnuncio.annuncio;
const activeStep = ref(5);

const tentativoInvio = reactive({ valore: false });

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

const inviaAnnuncio = () => {
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
  CreaAnnuncio(annuncio);
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
  <div class="flex flex-col gap-4 w-full items-center justify-center">
    <div
      class="justify-center border-1 border-green-300 rounded-lg p-2 bg-gray-100 my-2 mx-auto w-full md:w-3/4 lg:w-2/3 xl:w-3/4 2xl:w-4/5 flex"
    >
      <Stepper v-model:value="activeStep" class="w-full max-w-full">
        <StepList>
          <Step
            :value="1"
            :style="{
              '--p-stepper-step-number-background': step1.hasErrori
                ? '#ad0000'
                : '',
              '--p-stepper-step-number-color': step1.hasErrori ? 'white' : '',
            }"
          >
            <i class="pi pi-home" />
          </Step>
          <Divider />
          <Step
            :value="2"
            :style="{
              '--p-stepper-step-number-background': step2.hasErrori
                ? '#ad0000'
                : '',
              '--p-stepper-step-number-color': step2.hasErrori ? 'white' : '',
            }"
          >
            <i class="pi pi-home" />
          </Step>
          <Divider />
          <Step
            :value="3"
            :style="{
              '--p-stepper-step-number-background': step3.hasErrori
                ? '#ad0000'
                : '',
              '--p-stepper-step-number-color': step3.hasErrori ? 'white' : '',
            }"
          >
            <i class="pi pi-map"
          /></Step>
          <Divider />
          <Step
            :value="4"
            :style="{
              '--p-stepper-step-number-background': step4.hasErrori
                ? '#ad0000'
                : '',
              '--p-stepper-step-number-color': step4.hasErrori ? 'white' : '',
            }"
            ><i class="pi pi-map"
          /></Step>
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
            <StepDatiIniziali
              class=""
              ref="step1"
              v-model:annuncio="annuncio"
              :tentativoInvio="tentativoInvio.valore"
              @avanti="vaiAvanti"
            />
          </StepPanel>

          <StepPanel class="!bg-gray-100" :value="2">
            <Tag severity="secondary" class="my-4">
              <h3>Annuncio: Dettagli Annuncio</h3>
            </Tag>
            <StepDatiPrincipali
              ref="step2"
              v-model:annuncio="annuncio"
              @indietro="vaiIndietro"
              @avanti="vaiAvanti"
              :tentativoInvio="tentativoInvio.valore"
            />
          </StepPanel>
          <StepPanel class="!bg-gray-100" :value="4">
            <Tag severity="secondary" class="my-4">
              <h3>Annuncio: Indirizzo e Posizione</h3>
            </Tag>
            <StepIndirizzo
              ref="step4"
              :tentativoInvio="tentativoInvio.valore"
              :activeStep="activeStep"
              v-model:annuncio="annuncio"
              @indietro="vaiIndietro"
              @avanti="vaiAvanti"
            />
          </StepPanel>
          <StepPanel class="!bg-gray-100" :value="3">
            <Tag severity="secondary" class="my-4">
              <h3>Annuncio: Caratteristiche</h3>
            </Tag>
            <StepCaratteristiche
              ref="step3"
              v-model:annuncio="annuncio"
              @indietro="vaiIndietro"
              @avanti="vaiAvanti"
              :tentativoInvio="tentativoInvio.valore"
            />
          </StepPanel>
          <StepPanel class="!bg-gray-100" :value="5">
            <Tag severity="secondary" class="my-4">
              <h3>Annuncio: Caricamento Immagini</h3>
            </Tag>
            <StepImmagini
              v-model:annuncio="annuncio"
              @indietro="vaiIndietro"
              @avanti="vaiAvanti"
            />
          </StepPanel>
          <StepPanel class="!bg-gray-100" :value="6">
            <Tag severity="secondary" class="my-4">
              <h3>Annuncio: Anteprima</h3>
            </Tag>
            <Anteprima
              v-model:annuncio="annuncio"
              @indietro="vaiIndietro"
              @invia="inviaAnnuncio"
            />
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
