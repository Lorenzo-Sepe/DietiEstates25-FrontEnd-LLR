<template>

    <div class="form-controproposta ">
        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
                <div class="flex flex-row">
                    <label class="text-gray-500"> Proposta di </label>
                    <label class="font-bold text-gray-900 ml-1"> nome cognome </label>
                </div>
                <div class="flex flex-row">
                    <label class="text-gray-500"> Prezzo  proposto </label>
                    <label class="font-bold text-gray-900 ml-1"> prezzo </label>
                </div>
            </div>

            <div class="flex flex-col gap-1">
                <label class="font-bold block mb-2"> Scrivi la tua controproposta </label>
                <InputNumber v-model="controproposta" inputId="currency-germany" mode="currency" currency="EUR"
                    locale="de-DE" />
            </div>

            <Button label="Effettua controproposta" class="w-full" @click="clickControproposta" />
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue';

import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const controproposta = ref(0);

</script>