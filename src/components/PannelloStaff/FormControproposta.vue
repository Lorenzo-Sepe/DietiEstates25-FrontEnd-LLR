<template>
  <div class="form-controproposta">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <div class="flex flex-row">
          <label class="text-gray-500"> Proposta di </label>
          <label class="font-bold text-gray-900 ml-1">
            {{ props.proposta.datiProponente.nome }}
            {{ props.proposta.datiProponente.cognome }}</label
          >
        </div>
        <div class="flex flex-row">
          <label class="text-gray-500"> Prezzo proposto </label>
          <label class="font-bold text-gray-900 ml-1">
            {{ props.proposta.prezzoProposta }}
          </label>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-bold block mb-2">
          Scrivi la tua controproposta
        </label>
        <InputNumber
          v-model="controproposta"
          :invalid="errore.invalido"
          inputId="currency-germany"
          mode="currency"
          currency="EUR"
          locale="de-DE"
        />
        <Message severity="error" variant="simple" size="small">{{
          errore.messaggio
        }}</Message>
      </div>

      <Button
        label="Effettua controproposta"
        class="w-full"
        @click="clickEffettuaControproposta"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";

import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import Message from "primevue/message";

const props = defineProps(["proposta"]);
const emit = defineEmits(["controproposta"]);

const controproposta = ref(0);

const errore = reactive({
  invalido: false,
  messaggio: "",
});

const clickEffettuaControproposta = () => {
  if (controproposta.value <= props.proposta.prezzoProposta) {
    errore.invalido = true;
    errore.messaggio = "Inserire un valore maggiore della proposta effettuata";
  } else {
    errore.invalido = false;
    errore.messaggio = "";
    emit("controproposta", props.proposta.idProposta, controproposta.value);
  }
};
</script>
