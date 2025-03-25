<script setup>
import { reactive, ref, watch } from 'vue';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import Divider from 'primevue/divider';
import { CreaAnnuncio } from '../services/CreazioneModificaAnnunciService';
import StepDatiIniziali from '../components/CreaAnnuncio/StepDatiGenerali.vue';
import StepDatiPrincipali from '../components/CreaAnnuncio/StepDatiPrincipali.vue';
import StepIndirizzo from '../components/CreaAnnuncio/StepIndirizzo.vue';
import StepImmagini from '../components/CreaAnnuncio/StepCaricamentoImmagini.vue';
import { useStoreAnnuncio } from '../stores/CreazioneAnnuncioStore';
const storeAnnuncio = useStoreAnnuncio();

const annuncio = storeAnnuncio.annuncio;
const activeStep = ref(1);

const tentativoInvio = reactive({ valore: false });

const vaiAvanti = () => {
  if (activeStep.value < 3) activeStep.value++;
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
  if(!step1.value.validaCampi()){
    activeStep.value = 1;
    step2.value.validaCampi();
    return;
  }else if (!step2.value.validaCampi()){
    activeStep.value = 2;
    return;
  }
  CreaAnnuncio(annuncio);
  
};

watch(activeStep, (newVal) => {
  if (newVal>1) {
    step1.value.validaCampi();
  }
  if (newVal>2) {
    step2.value.validaCampi();
  }

});



</script>

<template>
<div class="card flex justify-center mt-8 mx-4 md:mx-auto w-full md:max-w-2/3">
  <Stepper v-model:value="activeStep">
      <StepList>
        <Step :value="1"   :style="{ '--p-stepper-step-number-background': step1.hasErrori ? '#ad0000' : '', '--p-stepper-step-number-color': step1.hasErrori ? 'white' : '' }"        >
          <i class="pi pi-home" /></Step>
             <Divider />
        <Step :value="2"
         :style="{ '--p-stepper-step-number-background': step2.hasErrori ? '#ad0000' : '', '--p-stepper-step-number-color': step2.hasErrori ? 'white' : '' }" 
          >
          <i class="pi pi-home" /></Step>  
            <Divider />
        <Step :value="3"><i class="pi pi-map" /></Step>
            <Divider />
        <Step :value="4"><i class="pi pi-map" /></Step>
            <Divider />
        <Step :value="5"><i class="pi pi-images" /></Step>
      </StepList>
      
      <StepPanels class="">
        <StepPanel :value="1">
          <h3>Informazioni di Base</h3>
          <StepDatiIniziali
             ref="step1" 
            v-model:annuncio="annuncio"
            :tentativoInvio="tentativoInvio.valore"
            @avanti="vaiAvanti" 
          />
        </StepPanel>

        <StepPanel :value="2">
          <h3>Dettagli Annuncio</h3>
          <StepDatiPrincipali 
          ref="step2"
            v-model:annuncio="annuncio" 
            @indietro="vaiIndietro" 
            @avanti="vaiAvanti" 
            :tentativoInvio="tentativoInvio.valore"
          />
        </StepPanel>
        <StepPanel :value="3">
          <h3>Indirizzo e Posizione</h3>
          <StepIndirizzo 
            v-model:annuncio="annuncio" 
            @indietro="vaiIndietro" 
            @avanti="vaiAvanti" 
                      />
        </StepPanel>

        <StepPanel :value="4">
          <StepImmagini 
            v-model:annuncio="annuncio" 
            @indietro="vaiIndietro" 
            @invia="inviaAnnuncio" 
          />
        </StepPanel><StepPanel :value="5">
          <StepImmagini 
            v-model:annuncio="annuncio" 
            @indietro="vaiIndietro" 
            @invia="inviaAnnuncio" 
          />
        </StepPanel>
      </ StepPanels>
    </Stepper>
  </div>
</template>

<style >
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