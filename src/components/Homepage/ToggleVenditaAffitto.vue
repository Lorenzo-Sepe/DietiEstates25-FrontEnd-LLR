<template>
  <div class="inline-flex ring-1 ring-primary-200 rounded">
    <Button
      label="Affitto"
      :severity="severityAffitto"
      :variant="variantAffitto"
      @click="toggleButtonsAffitto"
    />
    <Button
      label="Vendita"
      :severity="severityVendita"
      :variant="variantVendita"
      @click="toggleButtonsVendita"
    />
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import Button from "primevue/button";

const severityAffitto = ref("primary");
const severityVendita = ref("secondary");
const variantAffitto = ref("raised");
const variantVendita = ref("text");

const props = defineProps(["contrattoSelezionato"]);

const toggleButtonsAffitto = () => {
  severityAffitto.value = "primary";
  severityVendita.value = "secondary";

  variantAffitto.value = "raised";
  variantVendita.value = "text";

  props.contrattoSelezionato.value = "AFFITTO";
};

const toggleButtonsVendita = () => {
  severityAffitto.value = "secondary";
  severityVendita.value = "primary";

  variantAffitto.value = "text";
  variantVendita.value = "raised";

  props.contrattoSelezionato.value = "VENDITA";
};
</script>
