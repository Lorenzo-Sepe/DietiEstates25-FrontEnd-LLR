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
import Tag from "primevue/tag";
import Anteprima from "../components/CreaAnnuncio/Anteprima.vue";
import StepCaratteristiche from "../components/CreaAnnuncio/StepCaratteristiche.vue";
const storeAnnuncio = useStoreAnnuncio();

const annuncio = storeAnnuncio.annuncio;
const activeStep = ref(1);

const tentativoInvio = reactive({ valore: false });

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
  const response = CreaAnnuncio(annuncio);
  if(response) {
    console.log("Annuncio inviato con successo:", response);
    alert(response.value);
  }
  
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
  <div class="flex flex-col gap-4 w-full mx-3 items-center justify-center">
    <h1 class="my-4 mx-4">CREAZIONE NUOVO ANNUNCIO</h1>

    <div
      class="justify-center border-1 border-green-300 rounded-lg p-2 bg-gray-100 my-2 mx-auto w-full flex"
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
            <Tag severity="contrast" class="primeTags">
              <h3>Informazioni di Base</h3>
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
            <Tag severity="contrast" class="primeTags">
              <h3>Dettagli Annuncio</h3>
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
            <Tag severity="contrast" class="primeTags">
              <h3>Indirizzo e Posizione</h3>
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
            <Tag severity="contrast" class="primeTags">
              <h3>Caratteristiche</h3>
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
            <StepImmagini
              v-model:annuncio="annuncio"
              @indietro="vaiIndietro"
              @avanti="vaiAvanti"
            />
          </StepPanel>
          <StepPanel class="!bg-gray-100" :value="6">
            <Anteprima
              v-model:annuncio="annuncio"
              @indietro="vaiIndietro"clearable
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

.primeTags {
  margin-block: calc(var(--spacing) * 2) /* 1rem = 16px */;
  width: calc(1 / 2 * 100%) /* 50% */;
  text-align: center;
}
</style>
