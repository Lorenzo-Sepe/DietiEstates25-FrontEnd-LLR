<template>
  <div class="form-proposta">
    <div class="card flex justify-center gap-2">
      <div class="flex-auto my-2">
        <label for="Nome" class="font-bold block mb-2"> Nome </label>
        <InputText id="nome" v-model="nome" :invalid="nomeNonValido" />
        <Message severity="error" variant="simple" size="small">{{
          errori.nome.messaggio
        }}</Message>
      </div>
      <div class="flex-auto my-2">
        <label for="Cognome" class="font-bold block mb-2"> Cognome </label>
        <InputText id="cognome" v-model="cognome" :invalid="cognomeNonValido" />
        <Message severity="error" variant="simple" size="small">{{
          errori.cognome.messaggio
        }}</Message>
      </div>
    </div>
    <div class="flex-auto my-2">
      <label for="Prezzo" class="font-bold block mb-2"> Prezzo </label>
      <InputNumber
        v-model="prezzo"
        :invalid="prezzoNonValido"
        inputId="prezzo"
        fluid
      />
      <Message severity="error" variant="simple" size="small">{{
        errori.prezzo.messaggio
      }}</Message>
    </div>
    <div class="card flex justify-center gap-2 my-2">
      <div class="flex-auto my-2">
        <label for="TipoContatto" class="font-bold block mb-2">
          Tipo contatto
        </label>
        <Select
          v-model="selectedTipoContatto"
          :invalid="tipoContattoNonValido"
          :options="tipiContatto"
          optionLabel="name"
          placeholder="Seleziona tipo contatto"
          class="w-full md:w-56"
        />
        <Message severity="error" variant="simple" size="small">{{
          errori.tipoContatto.messaggio
        }}</Message>
      </div>
      <div class="flex-auto my-2">
        <label for="Contatto" class="font-bold block mb-2">
          Info contatto
        </label>
        <InputText
          id="contatto"
          v-model="contatto"
          :invalid="contattoNonValido"
        />
        <Message severity="error" variant="simple" size="small">{{
          errori.contatto.messaggio
        }}</Message>
      </div>
    </div>
    <Button
      label="Aggiungi proposta"
      class="w-full"
      @click="clickNuovaProposta"
    />
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits } from "vue";

import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import Message from "primevue/message";
import Button from "primevue/button";

const props = defineProps(["propostaRequest", "idAnnuncio", "visible"]);
const emit = defineEmits(["nuovaProposta"]);

const nome = ref("");
const nomeNonValido = ref(false);
const cognome = ref("");
const cognomeNonValido = ref(false);
const prezzo = ref(0);
const prezzoNonValido = ref(false);
const contatto = ref("");
const contattoNonValido = ref();

const selectedTipoContatto = ref(null);
const tipiContatto = ref([
  { name: "Cellulare", code: "cell" },
  { name: "Email", code: "email" },
  { name: "Facebook", code: "fb" },
  { name: "Instagram", code: "ins" },
  { name: "Telegram", code: "tel" },
]);
const tipoContattoNonValido = ref(false);

// Stato per il controllo degli errori
const errori = reactive({
  nome: { invalid: false, messaggio: "" },
  cognome: { invalid: false, messaggio: "" },
  prezzo: { invalid: false, messaggio: "" },
  tipoContatto: { invalid: false, messaggio: "" },
  contatto: { invalid: false, messaggio: "" },
});

const controllaNome = () => {
  if (nome.value.length === 0) {
    errori.nome.invalid = true;
    errori.nome.messaggio = "Il nome è obbligatorio";
    nomeNonValido.value = true;
  } else if (nome.value.length < 3) {
    errori.nome.invalid = true;
    errori.nome.messaggio = "Il nome deve essere di almeno 3 caratteri";
    nomeNonValido.value = true;
  } else if (nome.value.length > 30) {
    errori.nome.invalid = true;
    errori.nome.messaggio = "Il titolo deve essere di massimo 30 caratteri";
    nomeNonValido.value = true;
  } else {
    errori.nome.invalid = false;
    errori.nome.messaggio = "";
    nomeNonValido.value = false;
  }
};

const controllaCognome = () => {
  if (cognome.value.length === 0) {
    errori.cognome.invalid = true;
    errori.cognome.messaggio = "Il cognome è obbligatorio";
    cognomeNonValido.value = true;
  } else if (cognome.value.length < 3) {
    errori.cognome.invalid = true;
    errori.cognome.messaggio = "Il nome deve essere di almeno 3 caratteri";
    cognomeNonValido.value = true;
  } else if (cognome.value.length > 30) {
    errori.cognome.invalid = true;
    errori.cognome.messaggio = "Il titolo deve essere di massimo 30 caratteri";
    cognomeNonValido.value = true;
  } else {
    errori.cognome.invalid = false;
    errori.cognome.messaggio = "";
    cognomeNonValido.value = false;
  }
};

const controllaPrezzo = () => {
  if (prezzo.value.length === 0) {
    errori.prezzo.invalid = true;
    errori.prezzo.messaggio = "Il prezzo è obbligatorio";
    prezzoNonValido.value = true;
  } else if (prezzo.value <= 0) {
    errori.prezzo.invalid = true;
    errori.prezzo.messaggio = "Il prezzo deve essere maggiore di 0";
    prezzoNonValido.value = true;
  } else {
    errori.prezzo.invalid = false;
    errori.prezzo.messaggio = "";
    prezzoNonValido.value = false;
  }
};

const controllaTipoContatto = () => {
  if (selectedTipoContatto.value === null) {
    errori.tipoContatto.invalid = true;
    errori.tipoContatto.messaggio = "Selezionare un tipo di contatto";
    tipoContattoNonValido.value = true;
  } else {
    errori.tipoContatto.invalid = false;
    errori.tipoContatto.messaggio = "";
    tipoContattoNonValido.value = false;
  }
};

const controllaContatto = () => {
  if (contatto.value.length === 0) {
    errori.contatto.invalid = true;
    errori.contatto.messaggio = "Il contatto è obbligatorio";
    contattoNonValido.value = true;
  } else if (contatto.value.length < 5) {
    errori.contatto.invalid = true;
    errori.contatto.messaggio = "Il contatto deve essere di almeno 5 caratteri";
    cognomeNonValido.value = true;
  } else if (contatto.value.length > 30) {
    errori.contatto.invalid = true;
    errori.contatto.messaggio =
      "Il contatto deve essere di massimo 30 caratteri";
    contattoNonValido.value = true;
  } else {
    errori.contatto.invalid = false;
    errori.contatto.messaggio = "";
    contattoNonValido.value = false;
  }
};

const clickNuovaProposta = async () => {
  controllaNome();
  controllaCognome();
  controllaPrezzo();
  controllaContatto();
  controllaTipoContatto();

  if (
    errori.nome.invalid ||
    errori.cognome.invalid ||
    errori.prezzo.invalid ||
    errori.contatto.invalid ||
    errori.tipoContatto.invalid
  ) {
    return;
  }

  props.propostaRequest.nome = nome.value;
  props.propostaRequest.cognome = cognome.value;
  props.propostaRequest.prezzo = prezzo.value;
  props.propostaRequest.tipoContatto = "TELEFONO";
  props.propostaRequest.contatto = contatto.value;
  props.propostaRequest.annuncioId = props.idAnnuncio;

  console.log("propostaRequest: ", props.propostaRequest);

  emit("nuovaProposta");
};
</script>
