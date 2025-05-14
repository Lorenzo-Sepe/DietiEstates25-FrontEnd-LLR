
<template>
  <div
    class="gap-4 rounded-md my-2 p-6 sm:p-8 md:p-10 bg-white shadow-md"
    :class="{ 'contrast-mode': contrastMode }"
  >
    <h1 class="text-2xl font-semibold mb-4">Crea Notifica Promozionale</h1>
    <Form
      v-slot="$form"
      :initial-values="initialValues"
      :resolver="resolver"
      @submit="onFormSubmit"
    >
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Form Fields (Left) -->
        <div class="flex-1">
          <!-- Oggetto -->
          <div class="mb-6 flex flex-col">
            <label for="oggetto" class=" font-semibold text-lg mb-1">Oggetto</label>
            <InputText
              fluid
              v-model="NotificaPromozionaleRequest.oggetto"
              name="oggetto"
              id="oggetto"
              type="text"
              placeholder="Oggetto"
              class="w-full"
            />
            
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
            <label for="budgetRange" class="text-lg font-semibold mb-2">Budget (EUR)</label>
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
          <div class="flex flex-row justify-between gap-6 w-full">
            <!-- Tipo Contratto -->
            <div class="min-w-0">
              <label for="tipoDiContrattoDiInteresse" class="text-lg block font-semibold mb-2">Tipo Contratto</label>
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

            <!-- Tipologia Immobile -->
            <div class="flex-1">
              <label for="tipologiaDiImmobileDiInteresse" class="text-lg font-semibold block mb-2">Tipologia Immobile</label>
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

        </div>

        <!-- Markdown Editor (Right) -->
        <div class="">
          <label for="contenuto" class="text-lg font-semibold block mb-2">Contenuto</label>
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
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end mt-6">
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
import { useRouter } from "vue-router";

const router = useRouter();

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
  NotificaPromozionaleRequest.contenuto = DOMPurify.sanitize(NotificaPromozionaleRequest.contenuto);
  NotificheService.creaNotifica(NotificaPromozionaleRequest)
    .then((response) => {
      console.log("Response:", response);
      if (response.status === 200) {
        console.log("Notifica inviata con successo");
        router.push({ name: "Notifiche" });
        console.error("Errore interno del server");
      } else {
        console.error("Errore nell'invio della notifica");
        console.log("Response:", response);
        
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const resolver = ({ values }) => {
  const errors = {};

  if (!values.oggetto) {
    errors.oggetto = [{ message: "Inserire oggetto del messaggio" }];
  }

  if (!values.contenuto) {
    errors.contenuto = [{ message: "Inserire contenuto del messaggio." }];
  }

  return { values, errors };
};
</script>
