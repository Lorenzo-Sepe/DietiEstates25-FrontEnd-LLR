<template>
  <div
    class="gap-4 rounded-md my-2 p-6 md:p-8 bg-white shadow-md"
    :class="{ 'contrast-mode': contrastMode }"
  >
    <h1 class="text-2xl font-semibold mb-4">Crea Notifica Promozionale</h1>
    <Form 
    
      :initial-values="initialValues" 
      v-slot="$form"
      :resolver
      :validate-on-blur
      @submit="onFormSubmit">
      <!-- Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="space-y-6">
          <!-- Oggetto -->
          <FormField 
            name="oggetto" 
            v-slot="$campo">
              <label for="oggetto" class="font-semibold text-lg mb-1 block">Oggetto</label>
              <InputText
                v-bind="field"
                id="oggetto"
                type="text"
                placeholder="Oggetto"
                class="w-full"
              />
              <Message v-if="campo?.invalid" severity="error" size="small" variant="simple">
                {{$campo.error?.message}} 
              </Message>
          </FormField>

          <!-- Budget Slider -->
          <FormField 
          name="budget" 
            v-slot="$campo">
              <label for="budgetRange" 
                class="text-lg font-semibold mb-2 block">
                Budget (EUR)
              </label>
              <Slider
                v-model="budgetRange"
                :min="0"
                :max="100000"
                range
                class="w-full"
              />
              <div class="flex justify-between mt-2 text-sm text-gray-700">
                <span>€{{ budgetRange[0] }}</span>
                <span>€{{ budgetRange[1] }}</span>
              </div>
              <Message v-if="$campo?.invalid" severity="error" size="small" variant="simple">
                {{ $campo.error?.message }}
              </Message>
          </FormField>

          <!-- Contratto e Tipologia -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <!-- Tipo Contratto -->
            <FormField 
              name="tipoDiContrattoDiInteresse"
              v-slot="$campo">
                <div class="flex flex-col items-center text-center">
                  <label for="tipoDiContrattoDiInteresse" class="text-lg font-semibold mb-2 block">Tipo Contratto</label>
                  <RadioButtonGroup
                    v-model="NotificaPromozionaleRequest.criteridiRicerca.tipoDiContrattoDiInteresse"
                    name="tipoDiContrattoDiInteresse"
                    class="flex flex-wrap justify-center gap-4 p-4 rounded-md ring-1 ring-surface-400 bg-surface-100 w-full"
                  >
                    <div class="flex items-center gap-2">
                      <RadioButton inputId="Affitto" value="AFFITTO" severity="contrast" class="black-radio" />
                      <label for="Affitto">Affitto</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <RadioButton inputId="Vendita" value="VENDITA" severity="contrast" class="black-radio" />
                      <label for="Vendita">Vendita</label>
                    </div>
                  </RadioButtonGroup>
                </div>
                
            </FormField>

            <!-- Tipologia Immobile -->
            <FormField name="tipologiaDiImmobileDiInteresse">
                <div class="flex flex-col items-center text-center">
                  <label for="tipologiaDiImmobileDiInteresse" class="text-lg font-semibold mb-2 block">Tipologia Immobile</label>
                  <RadioButtonGroup
                    v-model="NotificaPromozionaleRequest.criteridiRicerca.tipologiaDiImmobileDiInteresse"
                    name="tipologiaDiImmobileDiInteresse"
                    class="flex flex-wrap justify-center gap-4 p-4 rounded-md ring-1 ring-surface-400 bg-surface-100 w-full"
                  >
                    <template v-for="type in immobileTypes" :key="type">
                      <div class="flex items-center gap-2">
                        <RadioButton :inputId="type" :value="type" class="black-radio" severity="contrast" />
                        <label :for="type">{{ type.charAt(0) + type.slice(1).toLowerCase() }}</label>
                      </div>
                    </template>
                  </RadioButtonGroup>
                </div>
                
            </FormField>
          </div>
        </div>

        <!-- Right Column -->
        <div class="flex flex-col justify-between h-full">
          <FormField name="contenuto" v-slot="$campo">
              <label for="contenuto" class="text-lg font-semibold block mb-2">Contenuto</label>
              <Markdown
               contrastMode="true"
                v-model="NotificaPromozionaleRequest.contenuto"
                class="w-full h-full max-w-full overflow-x-auto"
                label="Contenuto"

              />
              <Message v-if="$campo?.invalid" severity="error" size="small" variant="simple">
                {{ $campo.error?.message }}
              </Message>
              
          </FormField>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end mt-6">
        <Button type="submit" label="Invia" icon="pi pi-send" :disabled="$form.$invalid"/>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { Form, FormField } from "@primevue/forms";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import RadioButton from "primevue/radiobutton";
import RadioButtonGroup from "primevue/radiobuttongroup";
import Slider from "primevue/slider";
import Markdown from "../components/MarkdownEditor.vue";
import NotificheService from "../services/NotificheService";
import DOMPurify from "dompurify";
import { useRouter } from "vue-router";

const router = useRouter();
const contrastMode = ref(true);

const NotificaPromozionaleRequest = reactive({
  oggetto: "",
  contenuto: "",
  criteridiRicerca: {
    tipoDiContrattoDiInteresse: "AFFITTO",
    tipologiaDiImmobileDiInteresse: "APPARTAMENTO",
    budgetMin: 0,
    budgetMax: 50000,
  },
});

const immobileTypes = ['APPARTAMENTO', 'UFFICIO', 'POSTOAUTO', 'TERRENO', 'ALTRO'];

const budgetRange = computed({
  get: () => [
    NotificaPromozionaleRequest.criteridiRicerca.budgetMin,
    NotificaPromozionaleRequest.criteridiRicerca.budgetMax,
  ],
  set: ([min, max]) => {
    NotificaPromozionaleRequest.criteridiRicerca.budgetMin = min;
    NotificaPromozionaleRequest.criteridiRicerca.budgetMax = max;
  },
});

const initialValues = reactive({
  oggetto: NotificaPromozionaleRequest.oggetto,
  contenuto: NotificaPromozionaleRequest.contenuto,
  tipoDiContrattoDiInteresse: NotificaPromozionaleRequest.criteridiRicerca.tipoDiContrattoDiInteresse,
  tipologiaDiImmobileDiInteresse: NotificaPromozionaleRequest.criteridiRicerca.tipologiaDiImmobileDiInteresse,
  budget: budgetRange.value,
});

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

function onFormSubmit({ values }) {
  NotificaPromozionaleRequest.oggetto = values.oggetto;
  NotificaPromozionaleRequest.contenuto = DOMPurify.sanitize(values.contenuto);
  NotificaPromozionaleRequest.criteridiRicerca.tipoDiContrattoDiInteresse = values.tipoDiContrattoDiInteresse;
  NotificaPromozionaleRequest.criteridiRicerca.tipologiaDiImmobileDiInteresse = values.tipologiaDiImmobileDiInteresse;

  NotificheService.creaNotifica(NotificaPromozionaleRequest)
    .then((response) => {
      if (response.status === 200) {
        router.push({ name: "Notifiche" });
      } else {
        console.error("Errore nell'invio della notifica", response);
      }
    })
    .catch((error) => {
      console.error("Errore durante l'invio:", error);
    });
}
</script>

