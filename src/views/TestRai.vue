<script setup>
import { reactive, ref } from 'vue';

import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepItem from 'primevue/stepitem';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import Divider from 'primevue/divider';
import { AnnuncioImmobiliareRequest, Immagine } from '../dto/RequestAnnuncio';
import { CreaAnnuncio } from '../services/CreazioneModificaAnnunciService';

const annuncio = reactive(new AnnuncioImmobiliareRequest());
const activeStep = ref(1);
const opzioniTipologia = ['Appartamento', 'Villa', 'Monolocale', 'Attico'];
const opzioniContratto = ['Vendita', 'Affitto'];

const inviaAnnuncio = () => {
  console.log('Dati annuncio:', annuncio);
  CreaAnnuncio(annuncio);
};

const caricaImmagini = (event) => {
  const files = event.files;
  files.forEach((file, index) => {
    const immagine = new Immagine();
    immagine.file = file;
    immagine.descrizione = `Immagine ${index + 1}`;
    annuncio.immobile.immagini.push(immagine);
  });
};
</script>

<template>
  <div class="card flex justify-center">
    <Stepper v-model:value="activeStep" class="basis-[40rem]">
      <StepList>
        <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="1">
          <div class="flex flex-row flex-auto gap-2" v-bind="a11yAttrs.root">
            <button class="bg-transparent border-0 inline-flex flex-col gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
              <span :class="['rounded-full border-2 w-12 h-12 inline-flex items-center justify-center', { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700': value > activeStep }]">
                <i class="pi pi-home" />
              </span>
            </button>
            <Divider />
          </div>
        </Step>
        <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="2">
          <div class="flex flex-row flex-auto gap-2 pl-2" v-bind="a11yAttrs.root">
            <button class="bg-transparent border-0 inline-flex flex-col gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
              <span :class="['rounded-full border-2 w-12 h-12 inline-flex items-center justify-center', { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700': value > activeStep }]">
                <i class="pi pi-map" />
              </span>
            </button>
            <Divider />
          </div>
        </Step>
        <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="3">
          <div class="flex flex-row pl-2" v-bind="a11yAttrs.root">
            <button class="bg-transparent border-0 inline-flex flex-col gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
              <span :class="['rounded-full border-2 w-12 h-12 inline-flex items-center justify-center', { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700': value > activeStep }]">
                <i class="pi pi-images" />
              </span>
            </button>
          </div>
        </Step>
      </StepList>
      
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" :value="1">
          <div class="p-fluid">
            <label for="titolo">Titolo</label>
            <InputText id="titolo" v-model="annuncio.titolo" />
            
            <label for="descrizione">Descrizione</label>
            <Textarea id="descrizione" v-model="annuncio.descrizione" rows="4" />
          </div>
          <div class="flex pt-6 justify-end">
            <Button label="Avanti" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback(2)" />
          </div>
        </StepPanel>

        <StepPanel v-slot="{ activateCallback }" :value="2">
          <div class="p-fluid">
            <label for="via">Via</label>
            <InputText id="via" v-model="annuncio.immobile.indirizzo.via" />
            
            <label for="citta">Città</label>
            <InputText id="citta" v-model="annuncio.immobile.indirizzo.citta" />
          </div>
          <div class="flex pt-6 justify-between">
            <Button label="Indietro" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(1)" />
            <Button label="Avanti" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback(3)" />
          </div>
        </StepPanel>

        <StepPanel v-slot="{ activateCallback }" :value="3">
          <FileUpload mode="advanced" name="file" @select="caricaImmagini" accept="image/*" multiple />
          <div class="flex pt-6 justify-between">
            <Button label="Indietro" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(2)" />
            <Button label="Invia Annuncio" icon="pi pi-check" @click="inviaAnnuncio" class="p-mt-2" />
          </div>
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
