<template>

    <div class="inline-flex">
        <Button label="Affitto" :severity="severityAffitto" :variant="variantAffitto" @click="toggleButtonsAffitto" />
        <Button label="Vendita" :severity="severityVendita" :variant="variantVendita"  @click="toggleButtonsVendita" />
    </div>

</template>

<script setup>

import { ref } from 'vue';
import Select from 'primevue/select';
import Button from 'primevue/button';

const severityAffitto = ref('primary');
const severityVendita = ref('secondary');
const variantAffitto = ref('raised');
const variantVendita = ref('text');

const toggleButtonsAffitto = () => {

  severityAffitto.value = 'primary';
  severityVendita.value = 'secondary';

  variantAffitto.value = 'raised';
  variantVendita.value = 'text';
};

const toggleButtonsVendita = () => {

    severityAffitto.value = 'secondary';
    severityVendita.value = 'primary';

    variantAffitto.value = 'text';
    variantVendita.value = 'raised';
};


</script>