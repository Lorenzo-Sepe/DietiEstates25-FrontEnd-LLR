<script setup>
import {
  defineProps,
  ref,
  defineExpose,
  defineEmits,
  reactive,
  computed,
} from "vue";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import Button from "primevue/button";
import Message from "primevue/message";
import { AnnuncioImmobiliareRequest } from "../../dto/RequestAnnuncio";
import ContrattoForm from "./ContrattoComponet.vue";
import { scrollToFirstError } from "../../utils/scrollToError";
import StickyButtons from "./StickyButtons.vue";

const emit = defineEmits(["indietro", "avanti"]);

const props = defineProps({
  annuncio: AnnuncioImmobiliareRequest,
  tentativoInvio: Boolean,
});

const errori = reactive({
  prezzo: { invalid: false, messaggio: "" },
  mutuoEstinto: { invalid: false, messaggio: "" },
  metriQuadri: { invalid: false, messaggio: "" },
  numeroDiPiani: { invalid: false, messaggio: "" },
  numeroStanze: { invalid: false, messaggio: "" },
  numeroServizi: { invalid: false, messaggio: "" },
  classeEnergetica: {
    invalid: false,
    messaggio: "Seleziona una classe energetica",
  },
});

const opzioniClasseEnergetica = reactive([
  { label: "A++", value: "A_PLUS_PLUS" },
  { label: "A+", value: "A_PLUS" },
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
  { label: "D", value: "D" },
  { label: "E", value: "E" },
  { label: "F", value: "F" },
  { label: "G", value: "G" },
  { label: "Non specificata", value: "Non_Specificata" },
]);

// Funzione di validazione
const verificaDati = (campo) => {
  if (campo === "metriQuadri") {
    const metriQuadri = props.annuncio.immobile.metriQuadri || 0;
    if (metriQuadri <= 0) {
      errori.metriQuadri.invalid = true;
      errori.metriQuadri.messaggio =
        "I metri quadri devono essere un valore positivo";
    } else {
      errori.metriQuadri.invalid = false;
      errori.metriQuadri.messaggio = "";
    }
  } else if (campo === "numeroDiPiani") {
    const numeroDiPiani = props.annuncio.immobile.numeroDiPiani || 0;
    if (numeroDiPiani <= 0) {
      errori.numeroDiPiani.invalid = true;
      errori.numeroDiPiani.messaggio =
        "Il numero di piani deve essere almeno 1";
    } else {
      errori.numeroDiPiani.invalid = false;
      errori.numeroDiPiani.messaggio = "";
    }
  } else if (campo === "numeroStanze") {
    const numeroStanze = props.annuncio.immobile.numeroStanze || 0;
    if (numeroStanze <= 0) {
      errori.numeroStanze.invalid = true;
      errori.numeroStanze.messaggio =
        "Il numero di stanze deve essere almeno 1";
    } else {
      errori.numeroStanze.invalid = false;
      errori.numeroStanze.messaggio = "";
    }
  } else if (campo === "numeroServizi") {
    const numeroServizi = props.annuncio.immobile.numeroServizi || 0;
    if (numeroServizi <= 0) {
      errori.numeroServizi.invalid = true;
      errori.numeroServizi.messaggio =
        "Il numero di servizi deve essere almeno 1";
    } else {
      errori.numeroServizi.invalid = false;
      errori.numeroServizi.messaggio = "";
    }
  } else if (campo === "classeEnergetica") {
    errori.classeEnergetica.invalid = !props.annuncio.immobile.classeEnergetica;
  }
};

const validaCampi = () => {
  [
    "metriQuadri",
    "numeroDiPiani",
    "numeroStanze",
    "numeroServizi",
    "classeEnergetica",
  ].forEach((campo) => verificaDati(campo));
  refContratto.value.validaCampi();
  return !hasErrori.value;
};

const validaEAvanza = () => {
  if (validaCampi()) {
    emit("avanti");
  } else {
    if (refContratto.value && refContratto.value.hasErrori) {
      refContratto.value.$el.scrollIntoView({ behavior: "smooth" });
    } else {
      scrollToFirstError(errori);
    }
  }
};

const hasErrori = computed(() => {
  const hasError = Object.values(errori).some((e) => e.invalid);
  const hasErrorContratto = refContratto.value.hasErrori;
  return hasError || hasErrorContratto;
});

// Esponiamo la funzione verificaDati al componente genitore
defineExpose({
  validaCampi,
  hasErrori,
});

const refContratto = ref({});
</script>

<template>
  <div class="">
    <Message
      v-if="(hasErrori || refContratto.hasErrori) && tentativoInvio"
      severity="error"
      variant="filled"
      class="mb-4 text-left"
    >
      <p>
        Alcuni campi non sono corretti. Verifica e correggi i seguenti campi
        evidenziati in rosso:
      </p>
      <ul class="list-disc pl-5">
        <li v-if="errori.metriQuadri.invalid">Metri Quadrati</li>
        <li v-if="errori.numeroDiPiani.invalid">Numero di Piani</li>
        <li v-if="errori.numeroStanze.invalid">Numero di Stanze</li>
        <li v-if="errori.numeroServizi.invalid">Numero di Servizi</li>
        <li v-if="errori.classeEnergetica.invalid">Classe Energetica</li>
        <li v-if="refContratto.errori.prezzo.invalid">Prezzo</li>
        <li v-if="refContratto.errori.caparra.invalid">Caparra</li>
        <li v-if="refContratto.errori.tempoMinimo.invalid">Tempo Minimo</li>
        <li v-if="refContratto.errori.tempoMassimo.invalid">Tempo Massimo</li>
      </ul>
    </Message>

    <ContrattoForm
      ref="refContratto"
      v-model:contratto="annuncio.contratto"
      :tentativoInvio="tentativoInvio"
    />

    <!-- Griglia responsive: 2 colonne su dispositivi medi/grandi, 1 colonna su dispositivi piccoli -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 border p-2">
      <!-- Campo Metri Quadri -->
      <div>
        <label for="metriQuadri" class="block font-semibold mb-2"
          >Metri Quadri</label
        >
        <InputNumber
          id="metriQuadri"
          v-model="annuncio.immobile.metriQuadri"
          suffix=" m²"
          :invalid="errori.metriQuadri.invalid"
          @input="verificaDati('metriQuadri')"
          @blur="verificaDati('metriQuadri')"
          class="border rounded p-2 w-full"
        />
        <Message
          v-if="errori.metriQuadri.invalid"
          severity="error"
          variant="simple"
          size="small"
        >
          {{ errori.metriQuadri.messaggio }}
        </Message>
      </div>

      <!-- Campo Numero di Piani -->
      <div>
        <label for="numeroDiPiani" class="block font-semibold mb-2"
          >Numero di Piani</label
        >
        <InputNumber
          id="numeroDiPiani"
          v-model="annuncio.immobile.numeroDiPiani"
          suffix=" piani"
          :invalid="errori.numeroDiPiani.invalid"
          @input="verificaDati('numeroDiPiani')"
          @blur="verificaDati('numeroDiPiani')"
          class="border rounded p-2 w-full"
        />
        <Message
          v-if="errori.numeroDiPiani.invalid"
          severity="error"
          variant="simple"
          size="small"
        >
          {{ errori.numeroDiPiani.messaggio }}
        </Message>
      </div>

      <!-- Campo Numero di Stanze -->
      <div>
        <label for="numeroStanze" class="block font-semibold mb-2"
          >Numero di Stanze</label
        >
        <InputNumber
          id="numeroStanze"
          v-model="annuncio.immobile.numeroStanze"
          :invalid="errori.numeroStanze.invalid"
          @input="verificaDati('numeroStanze')"
          @blur="verificaDati('numeroStanze')"
          class="border rounded p-2 w-full"
        />
        <Message
          v-if="errori.numeroStanze.invalid"
          severity="error"
          variant="simple"
          size="small"
        >
          {{ errori.numeroStanze.messaggio }}
        </Message>
      </div>

      <!-- Campo Numero di Servizi -->
      <div>
        <label for="numeroServizi" class="block font-semibold mb-2"
          >Numero di Servizi</label
        >
        <InputNumber
          id="numeroServizi"
          v-model="annuncio.immobile.numeroServizi"
          :invalid="errori.numeroServizi.invalid"
          @input="verificaDati('numeroServizi')"
          @blur="verificaDati('numeroServizi')"
          class="border rounded p-2 w-full"
        />
        <Message
          v-if="errori.numeroServizi.invalid"
          severity="error"
          variant="simple"
          size="small"
        >
          {{ errori.numeroServizi.messaggio }}
        </Message>
      </div>

      <!-- Campo Classe Energetica (occupazione di entrambe le colonne) -->
      <div class="md:col-span-2">
        <label for="classeEnergetica" class="block font-semibold mb-2"
          >Classe Energetica</label
        >
        <Select
          id="classeEnergetica"
          v-model="annuncio.immobile.classeEnergetica"
          :options="opzioniClasseEnergetica"
          optionLabel="label"
          optionValue="value"
          placeholder="Seleziona la classe energetica"
          :invalid="errori.classeEnergetica.invalid"
          @blur="verificaDati('classeEnergetica')"
          @change="verificaDati('classeEnergetica')"
          class="border rounded p-2 w-full"
        />
        <Message
          v-if="errori.classeEnergetica.invalid"
          severity="error"
          variant="simple"
          size="small"
        >
          {{ errori.classeEnergetica.messaggio }}
        </Message>
      </div>
    </div>

    <StickyButtons>
      <div class="flex justify-end pt-6">
        <Button
          label="Avanti"
          icon="pi pi-arrow-right"
          iconPos="right"
          @click="validaEAvanza"
        />
      </div>
    </StickyButtons>
  </div>
</template>
