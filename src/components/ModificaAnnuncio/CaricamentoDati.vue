<template>

    <Dialog v-model:visible="visible" :closable="false" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="card">
            <ProgressBar :value="valoreCaricamento" />
        </div>
        <p>Caricamento dati in corso...</p>
    </Dialog>

    <div class="flex flex-col gap-4 w-full items-center justify-center">
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
                        <div class="">
                            <div class="flex flex-col gap-4">

                                <div class="flex flex-col">
                                    <label for="titolo" class="font-semibold">Titolo</label>
                                    <InputText id="titolo" v-model="inputFake"
                                        class="!border-1 !border-black !rounded-lg !p-2" />
                                </div>

                                <div class="flex flex-col">
                                    <label for="descrizione" class="font-semibold">Descrizione</label>
                                    <Textarea id="descrizione" v-model="inputFake" rows="4"
                                        class="!border-1 !border-black !rounded-lg !p-2" />
                                </div>

                                <div class="flex flex-col">
                                    <label for="tipoContratto" class="font-semibold">Tipo di Contratto</label>
                                    <Select id="tipoContratto" v-model="inputFake" placeholder="Seleziona il contratto"
                                        class="!border-1 !border-black !rounded-lg !p-2" />
                                </div>

                                <div class="flex flex-col">
                                    <label for="tipologiaImmobile" class="font-semibold">Tipologia di Immobile</label>
                                    <Select id="tipologiaImmobile" v-model="inputFake"
                                        placeholder="Seleziona la tipologia"
                                        class="!border-1 !border-black !rounded-lg !p-2" />
                                </div>

                            </div>

                            <StickyButtons>
                                <div class="flex pt-6 justify-between">
                                    <Button label="Indietro" severity="secondary" icon="pi pi-arrow-left"
                                        @click="$emit('indietro')" />
                                    <Button label="Avanti" icon="pi pi-arrow-right" iconPos="right"
                                        @click="validaEAvanza" />
                                </div>
                            </StickyButtons>
                        </div>
                    </StepPanel>

                    <StepPanel class="!bg-gray-100" :value="2">
                        <Tag severity="secondary" class="my-4">
                            <h3>Annuncio: Dettagli Annuncio</h3>
                        </Tag>
                    </StepPanel>
                    <StepPanel class="!bg-gray-100" :value="4">
                        <Tag severity="secondary" class="my-4">
                            <h3>Annuncio: Indirizzo e Posizione</h3>
                        </Tag>
                    </StepPanel>
                    <StepPanel class="!bg-gray-100" :value="3">
                        <Tag severity="secondary" class="my-4">
                            <h3>Annuncio: Caratteristiche</h3>
                        </Tag>
                    </StepPanel>
                    <StepPanel class="!bg-gray-100" :value="5">
                        <Tag severity="secondary" class="my-4">
                            <h3>Annuncio: Caricamento Immagini</h3>
                        </Tag>
                    </StepPanel>
                    <StepPanel class="!bg-gray-100" :value="6">
                        <Tag severity="secondary" class="my-4">
                            <h3>Annuncio: Anteprima</h3>
                        </Tag>
                    </StepPanel>
                </StepPanels>
            </Stepper>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineEmits } from "vue";

import Stepper from "primevue/stepper";
import StepList from "primevue/steplist";
import StepPanels from "primevue/steppanels";
import Step from "primevue/step";
import StepPanel from "primevue/steppanel";
import Divider from "primevue/divider";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import Button from "primevue/button";
import Tag from "primevue/tag";
import ProgressBar from 'primevue/progressbar';
import Dialog from 'primevue/dialog';


const activeStep = ref(1);

// Oggetto per contenere i riferimenti ai form
const step1 = ref({});
const step2 = ref({});
const step3 = ref({});
const step4 = ref({});

const visible = ref(true);

const inputFake = ref(null);

const emit = defineEmits(['loadingComplete']);

onMounted(() => {

    startProgress();
});

onBeforeUnmount(() => {
    endProgress();
});

const valoreCaricamento = ref(0);
const interval = ref();
const startProgress = () => {
    interval.value = setInterval(() => {
        let newValue = valoreCaricamento.value + Math.floor(Math.random() * 50) + 1;
        if (newValue >= 100) {
            newValue = 100;
            endProgress();
        }
        valoreCaricamento.value = newValue;
    }, 1000);
};
const endProgress = () => {

    clearInterval(interval.value);
    interval.value = null;

    emit('loadingComplete');
};


</script>