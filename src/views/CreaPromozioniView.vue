<template>
  <div
    class="my-container gap-4 rounded-md p-6 sm:p-8 md:p-10 bg-white shadow-md"
    :class="{ 'contrast-mode': contrastMode }"
  >
    <h1 class="text-2xl font-semibold mb-4">Crea Notifica Promozionale</h1>
    <Form
      v-slot="$form"
      :initial-values="initialValues"
      :resolver="resolver"
      @submit="onFormSubmit"
    >
      <!-- Oggetto -->
      <div class="mb-6 flex flex-col">
        <InputText
          fluid
          v-model="NotificaPromozionaleRequest.oggetto"
          name="oggetto"
          id="oggetto"
          type="text"
          placeholder="Oggetto"
          class="w-full"
        />
        <label for="oggetto" class="text-lg font-medium mb-1">Oggetto</label>
        <Message
          v-if="$form.oggetto?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.oggetto.error?.message }}
        </Message>
      </div>

      <!-- Budget Slider -->
<div class="mb-6 flex flex-col">
  <label for="budgetRange" class="text-lg font-medium mb-2">Budget (EUR)</label>
  <Slider
    v-model="budgetRange"
    :min="0"
    :max="100000"
    :step="1000"
    range
    class="w-full"
  />
  <div class="flex justify-between mt-2 text-sm text-gray-700">
    <span>€{{ budgetRange[0] }}</span>
    <span>€{{ budgetRange[1] }}</span>
  </div>

  <!-- Error display -->
  <Message
    v-if="$form.budget?.invalid"
    severity="error"
    size="small"
    variant="simple"
  >
    {{ $form.budget.error?.message }}
  </Message>
</div>


      <!-- Tipo Contratto + Tipologia Immobile -->
      <div class="flex flex-col lg:flex-row gap-6 mb-6">
        <div class="flex-1">
          <h2 class="text-lg font-medium mb-2">Tipo Contratto</h2>
          <RadioButtonGroup
            v-model="NotificaPromozionaleRequest.criteridiRicerca.tipoDiContrattoDiInteresse"
            name="tipoDiContrattoDiInteresse"
            class="flex flex-wrap gap-4 p-4 rounded-md ring-1 ring-surface-400 bg-surface-100"
          >
            <div class="flex items-center gap-2">
              <RadioButton
                severity="contrast"
                class="black-radio"
                inputId="Affitto"
                value="AFFITTO"
              />
              <label for="Affitto">Affitto</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton
                class="black-radio"
                severity="contrast"
                inputId="Vendita"
                value="VENDITA"
              />
              <label for="Vendita">Vendita</label>
            </div>
          </RadioButtonGroup>
        </div>

        <div class="flex-1">
          <h2 class="text-lg font-medium mb-2">Tipologia Immobile</h2>
          <RadioButtonGroup
            v-model="NotificaPromozionaleRequest.criteridiRicerca.tipologiaDiImmobileDiInteresse"
            name="tipologiaDiImmobileDiInteresse"
            class="flex flex-wrap gap-4 p-4 rounded-md ring-1 ring-surface-400 bg-surface-100"
          >
            <template v-for="type in ['APPARTAMENTO', 'UFFICIO', 'POSTOAUTO', 'TERRENO', 'ALTRO']" :key="type">
              <div class="flex items-center gap-2">
                <RadioButton
                  class="black-radio"
                  severity="contrast"
                  :inputId="type"
                  :value="type"
                />
                <label :for="type">{{ type.charAt(0) + type.slice(1).toLowerCase() }}</label>
              </div>
            </template>
          </RadioButtonGroup>
        </div>
      </div>

      <!-- Contenuto -->
      <div class="mb-6 flex flex-col">
        <h2 class="text-lg font-medium mb-2">Contenuto</h2>
        <Markdown
          name="contenuto"
          class="w-full max-w-full overflow-x-auto"
          v-model="NotificaPromozionaleRequest.contenuto"
          label="Contenuto"
          contrastMode="false"
        />
        <Message
          v-if="$form.contenuto?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.contenuto.error?.message }}
        </Message>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <Button
          type="submit"
          label="Invia"
          icon="pi pi-send"
          @click="sendTest"
        />
      </div>
    </Form>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import { ref, reactive, watch,computed } from "vue";
import Markdown from "../components/MarkdownEditor.vue";
import DOMPurify from "dompurify";
import NotificheService from "../services/NotificheService";
import RadioButton from "primevue/radiobutton";
import Message from "primevue/message";
import InputText from "primevue/inputtext";
import Slider from "primevue/slider";
import RadioButtonGroup from "primevue/radiobuttongroup";
import { Form } from "@primevue/forms";

const contrastMode = ref(true);

const NotificaPromozionaleRequest = reactive({
  contenuto: "",
  oggetto: "",
  criteridiRicerca: {
    areaDiInteresse: "Napoli",
    tipoDiContrattoDiInteresse: "AFFITTO",
    tipologiaDiImmobileDiInteresse: "APPARTAMENTO",
    budgetMin: 0,
    budgetMax: 50000,
   intervallogiorniStoricoRicerca: 0,
  },
});

// Computed property to bind the slider range
const budgetRange = computed({
  get: () => [
    NotificaPromozionaleRequest.criteridiRicerca.budgetMin,
    NotificaPromozionaleRequest.criteridiRicerca.budgetMax
  ],
  set: ([min, max]) => {
    NotificaPromozionaleRequest.criteridiRicerca.budgetMin = min
    NotificaPromozionaleRequest.criteridiRicerca.budgetMax = max
  }
})

// Watch all fields for logging input
watch(
  () => NotificaPromozionaleRequest,
  (newVal) => {
    console.log("Form Updated:", JSON.parse(JSON.stringify(newVal)));
  },
  { deep: true }
);

// Optional: watch specific fields for debugging
watch(() => NotificaPromozionaleRequest.oggetto, (val) => {
  console.log("Oggetto changed:", val);
});

const initialValues = reactive({
  tipoDiContrattoDiInteresse: NotificaPromozionaleRequest.criteridiRicerca.tipoDiContrattoDiInteresse,
  tipologiaDiImmobileDiInteresse: NotificaPromozionaleRequest.criteridiRicerca.tipologiaDiImmobileDiInteresse,
});

function onFormSubmit() {
  sendTest();
}

function sendTest() {
  NotificaPromozionaleRequest.contenuto = DOMPurify.sanitize(NotificaPromozionaleRequest.contenuto);
  NotificheService.creaNotifica(NotificaPromozionaleRequest)
    .then((response) => {
      console.log("Response:", response);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const resolver = ({ values }) => {
  const errors = {};

  if (!values.oggetto) {
    errors.oggetto = [{ message: "Inserire del messaggio" }];
  }

  if (!values.contenuto) {
    errors.contenuto = [{ message: "Inserire contenuto del messaggio." }];
  }

  if (!values.budget || values.budget.length !== 2) {
    errors.budget = [{ message: "Inserire un intervallo di budget valido." }];
  } else {
    const [min, max] = values.budget;
    if (min < 0 || max < 0) {
      errors.budget = [{ message: "Il budget non può essere negativo." }];
    } else if (min > max) {
      errors.budget = [{ message: "Il budget minimo non può superare il massimo." }];
    }
  }

  return { values, errors };
};
</script>
