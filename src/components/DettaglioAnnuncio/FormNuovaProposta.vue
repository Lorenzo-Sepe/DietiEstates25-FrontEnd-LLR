<template>

    <div class="form-nuova-proposta ">
        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
                <div class="flex flex-row">
                    <label class="text-gray-500"> Prezzo immobile </label>
                    <label class="font-bold text-gray-900 ml-1"> {{ props.prezzo }} </label>
                </div>
            </div>

            <div class="flex flex-col gap-1">
                <label class="font-bold block mb-2"> Scrivi la tua proposta </label>
                <InputNumber v-model="proposta" :invalid="errore.invalido" inputId="currency-germany" mode="currency" currency="EUR"
                    locale="de-DE" />
                <Message severity="error" variant="simple" size="small">{{ errore.messaggio }}</Message>
            </div>

            <Button label="Invia proposta" class="w-full" @click="clickEffettuaProposta" />
        </div>
    </div>

</template>

<script setup>
import { ref, reactive, defineProps, defineEmits } from 'vue';

import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Message from 'primevue/message';

const props = defineProps(['prezzo']);
const emit = defineEmits(['controproposta']);

const proposta = ref(0);

const errore = reactive({

    invalido: false,
    messaggio: ''
});

const clickEffettuaProposta = () => {

    if (proposta.value <= 0) {

        errore.invalido = true;
        errore.messaggio = 'Il prezzo proposto deve essere maggiore di 0';
       
    }else {
            
            errore.invalido = false;
            errore.messaggio = '';
            emit('controproposta', props.proposta.idProposta,controproposta.value);
    }
}

</script>