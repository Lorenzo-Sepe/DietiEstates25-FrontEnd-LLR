<template>

    <Dialog v-model:visible="dialogVisible" modal header="CONFERMA" :style="{ width: '25rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="w-full flex flex-col gap4">
            <label class="medium text-lg mb-2"> Confermi di voler inviare la proposta? </label>
            <div class="flex flex-row gap-2">
                <Button label="Conferma" class="w-full" @click="confermaInvio" />
                <Button label="Annulla" class="w-full" @click="dialogVisible = false" />
            </div>
        </div>
    </Dialog>

    <div class="form-nuova-proposta ">
        <div class="flex flex-col gap-4">

            <div class="flex flex-col gap-2 my-2">
                <div class="flex flex-col my-2">
                    <label for="Contatto" class="font-bold block mb-2"> Nome </label>
                    <InputText id="contatto" v-model="nome" :invalid="errori.nome.invalido" />
                </div>
                <div class="flex flex-col my-2">
                    <label for="Contatto" class="font-bold block mb-2"> Cognome </label>
                    <InputText id="contatto" v-model="cognome" :invalid="errori.cognome.invalido" />
                </div>
                <div class="flex flex-col my-2">
                    <label for="TipoContatto" class="font-bold block mb-2"> Tipo contatto </label>
                    <Select v-model="selectedTipoContatto" :invalid="errori.tipoContatto.invalido"
                        :options="tipiContatto" optionLabel="name" placeholder="Seleziona tipo contatto"
                        class="w-full md:w-56" />
                    <Message severity="error" variant="simple" size="small">{{ errori.tipoContatto.messaggio }}
                    </Message>
                </div>
                <div class="flex flex-col my-2">
                    <label for="Contatto" class="font-bold block mb-2"> Info contatto </label>
                    <InputText id="contatto" v-model="contatto" :invalid="errori.contatto.invalido" />
                    <Message severity="error" variant="simple" size="small">{{ errori.contatto.messaggio }}</Message>
                </div>
            </div>

            <div class="flex flex-col gap-1">
                <label class="font-bold block mb-2"> Scrivi la tua proposta </label>
                <InputNumber v-model="proposta" :invalid="errori.prezzo.invalido" inputId="currency-germany"
                    mode="currency" currency="EUR" locale="de-DE" />
                <Message severity="error" variant="simple" size="small">{{ errori.prezzo.messaggio }}</Message>
            </div>

            <Button label="Invia proposta" class="w-full" @click="clickEffettuaProposta" />
        </div>
    </div>

</template>

<script setup>
import { ref, reactive, defineProps, defineEmits } from 'vue';

import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Dialog from 'primevue/dialog';


const props = defineProps(['prezzo', 'propostaRequest']);
const emit = defineEmits(['inviaNuovaProposta']);

const selectedTipoContatto = ref(null);
const tipiContatto = ref([
    { name: 'TELEFONO', code: 'cell' },
    { name: 'EMAIL', code: 'email' },
    { name: 'MESSAGGIO', code: 'fb' },
]);
const contatto = ref('');
const nome = ref('');
const cognome = ref('');
const proposta = ref(0);

const dialogVisible = ref(false);

const errori = reactive({

    nome: {
        invalido: false,
        messaggio: ''
    },
    cognome: {
        invalido: false,
        messaggio: ''
    },

    tipoContatto: {
        invalido: false,
        messaggio: ''
    },
    contatto: {
        invalido: false,
        messaggio: ''
    },
    prezzo: {
        invalido: false,
        messaggio: ''
    }

});

const confermaInvio = () => {

    dialogVisible.value = false;
    emit('inviaNuovaProposta');

}

const clickEffettuaProposta = () => {

    errori.prezzo.invalido = false;
    errori.prezzo.messaggio = '';
    errori.tipoContatto.invalido = false;
    errori.tipoContatto.messaggio = '';
    errori.contatto.invalido = false;
    errori.contatto.messaggio = '';
    errori.nome.invalido = false;
    errori.nome.messaggio = '';
    errori.cognome.invalido = false;
    errori.cognome.messaggio = '';

    if (proposta.value <= 0) {

        errori.prezzo.invalido = true;
        errori.prezzo.messaggio = 'Il prezzo proposto deve essere maggiore di 0';

    }

    if (selectedTipoContatto.value == null) {

        errori.tipoContatto.messaggio = 'Seleziona un tipo di contatto';
        errori.tipoContatto.invalido = true;

    }

    if (contatto.value == '') {

        errori.contatto.messaggio = 'Inserisci un contatto valido';
        errori.contatto.invalido = true;

    }

    if (nome.value == '') {

        errori.nome.messaggio = 'Inserisci un nome valido';
        errori.nome.invalido = true;

    }
    if (cognome.value == '') {

        errori.cognome.messaggio = 'Inserisci un cognome valido';
        errori.cognome.invalido = true;

    }

    if (!errori.prezzo.invalido && !errori.tipoContatto.invalido && !errori.contatto.invalido && !errori.nome.invalido && !errori.cognome.invalido) {

        errori.prezzo.invalido = false;
        errori.prezzo.messaggio = '';
        errori.tipoContatto.invalido = false;
        errori.tipoContatto.messaggio = '';
        errori.contatto.invalido = false;
        errori.contatto.messaggio = '';
        errori.nome.invalido = false;
        errori.nome.messaggio = '';
        errori.cognome.invalido = false;
        errori.cognome.messaggio = '';

        props.propostaRequest.nome = nome.value;
        props.propostaRequest.cognome = cognome.value;
        props.propostaRequest.prezzo = proposta.value;
        props.propostaRequest.tipoContatto = selectedTipoContatto.value.name;
        props.propostaRequest.informazioniContatto = contatto.value;

        dialogVisible.value = true;
    }
}

</script>