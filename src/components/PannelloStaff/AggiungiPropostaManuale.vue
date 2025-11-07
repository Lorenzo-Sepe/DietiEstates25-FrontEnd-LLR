<template>
  <div class="form-proposta p-4 space-y-4">
    <!-- Nome e Cognome -->
    <div class="riga flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <label for="nome" class="font-bold block mb-2">Nome</label>
        <InputText id="nome" v-model="nome" :invalid="nomeNonValido" class="w-full" />
        <Message v-if="errori.nome.messaggio" severity="error" variant="simple" size="small">
          {{ errori.nome.messaggio }}
        </Message>
      </div>

      <div class="flex-1">
        <label for="cognome" class="font-bold block mb-2">Cognome</label>
        <InputText id="cognome" v-model="cognome" :invalid="cognomeNonValido" class="w-full" />
        <Message v-if="errori.cognome.messaggio" severity="error" variant="simple" size="small">
          {{ errori.cognome.messaggio }}
        </Message>
      </div>
    </div>

    <!-- Prezzo -->
    <div class="riga">
      <div class="flex-1">
        <label for="prezzo" class="font-bold block mb-2">Prezzo</label>
        <InputNumber v-model="prezzo" :invalid="prezzoNonValido" inputId="prezzo" class="w-full" />
        <Message v-if="errori.prezzo.messaggio" severity="error" variant="simple" size="small">
          {{ errori.prezzo.messaggio }}
        </Message>
      </div>
    </div>

    <!-- Tipo contatto e Info contatto -->
    <div class="riga flex flex-col md:flex-row gap-4">
      <div class="w-full md:w-1/2">
        <label for="TipoContatto" class="font-bold block mb-2">Tipo contatto</label>
        <Select v-model="selectedTipoContatto" :invalid="tipoContattoNonValido" :options="tipiContatto"
          optionLabel="name" placeholder="Seleziona tipo contatto" class="w-full" />
        <Message v-if="errori.tipoContatto.messaggio" severity="error" variant="simple" size="small">
          {{ errori.tipoContatto.messaggio }}
        </Message>
      </div>

      <div class="w-full md:w-1/2">
        <label for="contatto" class="font-bold block mb-2">Info contatto</label>
        <InputText id="contatto" v-model="contatto" :invalid="contattoNonValido" class="w-full" />
        <Message v-if="errori.contatto.messaggio" severity="error" variant="simple" size="small">
          {{ errori.contatto.messaggio }}
        </Message>
      </div>
    </div>

    <!-- Bottone -->
    <Button label="Aggiungi proposta" class="w-full mt-4" @click="clickNuovaProposta" />
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
  { name: "TELEFONO", code: "cell" },
  { name: "EMAIL", code: "email" },
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

  console.log("selectedTipoContatto", selectedTipoContatto.value);
  props.propostaRequest.nome = nome.value;
  props.propostaRequest.cognome = cognome.value;
  props.propostaRequest.prezzo = prezzo.value;
  props.propostaRequest.tipoContatto = selectedTipoContatto.value.name;
  props.propostaRequest.informazioniContatto = contatto.value;
  props.propostaRequest.annuncioId = props.idAnnuncio;

  emit("nuovaProposta");
};
</script>

<style scoped>
.form-proposta {
  display: flex;
  flex-direction: column;
}

.riga {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>
