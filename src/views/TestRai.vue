<script setup>
import { reactive, ref } from 'vue';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import Divider from 'primevue/divider';
import { AnnuncioImmobiliareRequest, Immagine } from '../dto/RequestAnnuncio';
import { CreaAnnuncio } from '../services/CreazioneModificaAnnunciService';
import StepDettagliAnnuncio from '../components/CreaAnnuncio/StepDatiGenerali.vue';
import StepIndirizzo from '../components/CreaAnnuncio/StepIndirizzo.vue';
import StepImmagini from '../components/CreaAnnuncio/StepCaricamentoImmagini.vue';
   
const annuncio = reactive(new AnnuncioImmobiliareRequest());
const activeStep = ref(1);

const vaiAvanti = () => {
  if (activeStep.value < 3) activeStep.value++;
};

const vaiIndietro = () => {
  if (activeStep.value > 1) activeStep.value--;
};

const inviaAnnuncio = () => {
  console.log('Dati annuncio:', annuncio);
  CreaAnnuncio(annuncio);
};
</script>

<template>
  <div class="card flex justify-center">
    <Stepper v-model:value="activeStep" class="basis-[40rem]">
      <StepList>
        <Step :value="1"><i class="pi pi-home" /></Step>
        <Divider />
        <Step :value="2"><i class="pi pi-map" /></Step>
        <Divider />
        <Step :value="3"><i class="pi pi-images" /></Step>
      </StepList>
      
      <StepPanels>
        <StepPanel :value="1">
          <StepDettagliAnnuncio 
            v-model:annuncio="annuncio" 
            @avanti="vaiAvanti" 
          />
        </StepPanel>

        <StepPanel :value="2">
          <StepIndirizzo 
            v-model:annuncio="annuncio" 
            @indietro="vaiIndietro" 
            @avanti="vaiAvanti" 
          />
        </StepPanel>

        <StepPanel :value="3">
          <StepImmagini 
            v-model:annuncio="annuncio" 
            @indietro="vaiIndietro" 
            @invia="inviaAnnuncio" 
          />
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>

<style scoped>
.p-fluid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
