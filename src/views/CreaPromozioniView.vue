<template>
  <div
    class="gap-4 rounded-md my-2 p-6 md:p-8 bg-white shadow-md"
    :class="{ 'contrast-mode': contrastMode }"
  >
    <h1 class="text-2xl font-semibold mb-4">Crea Notifica Promozionale</h1>
    <form @submit.prevent="onFormSubmit">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="space-y-6">
          <!-- Oggetto -->
          <div>
            <label for="oggetto" class="font-semibold text-lg mb-1 block"
              >Oggetto</label
            >
            <InputText
              id="oggetto"
              type="text"
              v-model="form.oggetto"
              placeholder="Oggetto"
              class="w-full"
              @blur="
                touched.oggetto = true;
                validateForm();
              "
            />
            <Message
              v-if="errors.oggetto"
              severity="error"
              size="small"
              class="mt-1"
            >
              {{ errors.oggetto }}
            </Message>
          </div>

          <!-- Area di Interesse -->
          <div>
            <label
              for="areaDiInteresse"
              class="text-lg font-semibold mb-2 block"
              >Area di Interesse</label
            >
            <InputRicerca
              id="areaDiInteresse"
              v-model="form.areaDiInteresse"
              class="w-full"
            />
            <Message
              v-if="errors.areaDiInteresse"
              severity="error"
              size="small"
              class="mt-1"
            >
              {{ errors.areaDiInteresse }}
            </Message>
          </div>

          <!-- Intervallo Giorni -->
          <div>
            <label
              for="intervalloGiorniStoricoRicerca"
              class="text-lg font-semibold mb-2 block"
            >
              Intervallo giorni Ricerca
            </label>
            <InputNumber
              v-model="form.intervalloGiorniStoricoRicerca"
              @blur="
                touched.intervalloGiorniStoricoRicerca = true;
                validateForm();
              "
              inputId="minmax-buttons"
              mode="decimal"
              showButtons
              :min="1"
              :max="100"
              fluid
            />
            <Message
              v-if="errors.intervalloGiorniStoricoRicerca"
              severity="error"
              size="small"
              class="mt-1"
            >
              {{ errors.intervalloGiorniStoricoRicerca }}
            </Message>
          </div>

          <!-- Budget Slider -->
          <div class="items-center">
            <label for="budgetRange" class="text-lg font-semibold mb-2 block"
              >Budget (EUR)</label
            >
            <div class="flex flex-row gap-3">
              <InputNumber
                fluid
                mode="currency"
                currency="EUR"
                :min="0"
                v-model="form.budgetMin"
                @blur="
                  touched.budgetMin = true;
                  validateForm();
                "
              />
              <InputNumber
                fluid
                mode="currency"
                currency="EUR"
                :min="0"
                v-model="form.budgetMax"
                @blur="
                  touched.budgetMax = true;
                  validateForm();
                "
              />
            </div>
            <Message
              v-if="errors.budgetRange"
              severity="error"
              size="small"
              class="mt-1"
            >
              {{ errors.budgetRange }}
            </Message>
          </div>

          <!-- Contratto e Tipologia -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <!-- Tipo Contratto -->
            <div class="text-center">
              <label
                for="tipoDiContrattoDiInteresse"
                class="text-lg font-semibold mb-2 block"
                >Tipo Contratto</label
              >
              <RadioButtonGroup
                @change="
                  touched.tipoDiContrattoDiInteresse = true;
                  validateForm();
                "
                v-model="form.tipoDiContrattoDiInteresse"
                name="tipoDiContrattoDiInteresse"
                class="flex flex-wrap justify-center gap-4 p-4 rounded-md ring-1 ring-surface-400 bg-surface-100 w-full"
              >
                <div class="flex items-center gap-2">
                  <RadioButton
                    inputId="Affitto"
                    value="AFFITTO"
                    class="black-radio"
                  />
                  <label for="Affitto">Affitto</label>
                </div>
                <div class="flex items-center gap-2">
                  <RadioButton
                    inputId="Vendita"
                    value="VENDITA"
                    class="black-radio"
                  />
                  <label for="Vendita">Vendita</label>
                </div>
              </RadioButtonGroup>
            </div>

            <!-- Tipologia Immobile -->
            <div class="text-center">
              <label
                for="tipologiaDiImmobileDiInteresse"
                class="text-lg font-semibold mb-2 block"
                >Tipologia Immobile</label
              >
              <RadioButtonGroup
                @change="
                  touched.tipologiaDiImmobileDiInteresse = true;
                  validateForm();
                "
                v-model="form.tipologiaDiImmobileDiInteresse"
                name="tipologiaDiImmobileDiInteresse"
                class="flex flex-wrap justify-center gap-4 p-4 rounded-md ring-1 ring-surface-400 bg-surface-100 w-full"
              >
                <template v-for="type in immobileTypes" :key="type">
                  <div class="flex items-center gap-2">
                    <RadioButton
                      :inputId="type"
                      :value="type"
                      class="black-radio"
                    />
                    <label :for="type">{{
                      type.charAt(0) + type.slice(1).toLowerCase()
                    }}</label>
                  </div>
                </template>
              </RadioButtonGroup>
            </div>
          </div>
        </div>

        <!-- Right Column: Contenuto -->
        <div class="flex flex-col justify-between h-full mb-6">
          <label for="contenuto" class="text-lg font-semibold block mb-2"
            >Contenuto</label
          >
          <Markdown
            id="contenuto"
            @blur="
              touched.contenuto = true;
              validateForm();
            "
            :contrastMode="contrastMode"
            v-model="form.contenuto"
            class="w-full h-full max-w-full overflow-x-auto"
            label="Contenuto"
            :class="{
              'ring-1 ring-red-500 rounded-md': errors.contenuto,
              'ring-1 ring-surface-400 rounded-md': !errors.contenuto,
            }"
          />
          <Message
            v-if="errors.contenuto"
            severity="error"
            size="small"
            class="mt-1"
          >
            {{ errors.contenuto }}
          </Message>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end mt-6">
        <Button
          severity="contrast"
          type="submit"
          label="Invia"
          icon="pi pi-send"
          :disabled="!formIsValid"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Message from "primevue/message";
import RadioButton from "primevue/radiobutton";
import RadioButtonGroup from "primevue/radiobuttongroup";
import Markdown from "../components/MarkdownEditor.vue";
import NotificheService from "../services/NotificheService";
import DOMPurify from "dompurify";
import { useRouter } from "vue-router";
import InputRicerca from "../components/Homepage/InputRicerca.vue";

const router = useRouter();
const contrastMode = ref(true);

const form = reactive({
  oggetto: "",
  contenuto: "",
  areaDiInteresse: "",
  intervalloGiorniStoricoRicerca: 30,
  budgetMin: 0,
  budgetMax: 50000,
  tipoDiContrattoDiInteresse: "AFFITTO",
  tipologiaDiImmobileDiInteresse: "APPARTAMENTO",
});

const touched = reactive({
  oggetto: false,
  contenuto: false,
  areaDiInteresse: false,
  budgetMin: false,
  budgetMax: false,
  intervalloGiorniStoricoRicerca: false,
  tipologiaDiImmobileDiInteresse: false,
});

const NotificaPromozionaleRequest = reactive({
  oggetto: "",
  contenuto: "",
  criteriDiRicerca: {
    areaDiInteresse: "",
    tipoDiContrattoDiInteresse: "AFFITTO",
    tipologiaDiImmobileDiInteresse: "APPARTAMENTO",
    budgetMin: 0,
    budgetMax: 50000,
    intervalloGiorniStoricoRicerca: 30,
  },
});

// ------------------------------------

const immobileTypes = [
  "APPARTAMENTO",
  "UFFICIO",
  "POSTOAUTO",
  "TERRENO",
  "ALTRO",
];

const errors = reactive({});

const formIsValid = computed(() => {
  return Object.values(errors).every((e) => e == null);
});

function validateOggetto() {
  if (touched.oggetto) {
    errors.oggetto = form.oggetto ? null : "Inserire oggetto del messaggio";
  }
}

function validateContenuto() {
  if (touched.contenuto) {
    errors.contenuto = form.contenuto
      ? null
      : "Inserire contenuto del messaggio.";
  }
}

function validateAreaDiInteresse() {
  if (touched.areaDiInteresse) {
    errors.areaDiInteresse = form.areaDiInteresse
      ? null
      : "Selezionare un'area di interesse.";
  }
}

function validateIntervalloGiorniStoricoRicerca() {
  if (touched.intervalloGiorniStoricoRicerca) {
    errors.intervalloGiorniStoricoRicerca =
      form.intervalloGiorniStoricoRicerca >= 1
        ? null
        : "Intervallo giorni non valido.";
  }
}

function validateTipologiaDiImmobileDiInteresse() {
  if (touched.tipologiaDiImmobileDiInteresse) {
    errors.tipologiaDiImmobileDiInteresse = form.tipologiaDiImmobileDiInteresse
      ? null
      : "Selezionare una tipologia di immobile.";
  }
}

function validateBudgetRange() {
  if (touched.budgetMin || touched.budgetMax) {
    errors.budgetRange =
      form.budgetMin < form.budgetMax
        ? null
        : "Il budget minimo deve essere inferiore al massimo.";
  }
}

function validateForm() {
  validateOggetto();
  validateContenuto();
  validateAreaDiInteresse();
  validateIntervalloGiorniStoricoRicerca();
  validateTipologiaDiImmobileDiInteresse();
  validateBudgetRange();

  return Object.values(errors).every((e) => e == null);
}

function onFormSubmit() {
  Object.keys(touched).forEach((key) => (touched[key] = true));
  validateForm();
  if (!formIsValid.value) return;

  NotificaPromozionaleRequest.oggetto = form.oggetto;
  NotificaPromozionaleRequest.contenuto = DOMPurify.sanitize(form.contenuto);
  NotificaPromozionaleRequest.criteriDiRicerca.budgetMin = form.budgetMin;
  NotificaPromozionaleRequest.criteriDiRicerca.budgetMax = form.budgetMax;
  NotificaPromozionaleRequest.criteriDiRicerca.areaDiInteresse =
    form.areaDiInteresse.comune;
  NotificaPromozionaleRequest.criteriDiRicerca.tipoDiContrattoDiInteresse =
    form.tipoDiContrattoDiInteresse;
  NotificaPromozionaleRequest.criteriDiRicerca.tipologiaDiImmobileDiInteresse =
    form.tipologiaDiImmobileDiInteresse;
  NotificaPromozionaleRequest.criteriDiRicerca.intervalloGiorniStoricoRicerca =
    form.intervalloGiorniStoricoRicerca;

  console.log("Notifica Promozionale Request:", NotificaPromozionaleRequest);

  NotificheService.creaNotifica(NotificaPromozionaleRequest)
    .then((response) => {
      console.log("Notifica creata con successo:", response);
      router.push({ name: "PortaleAgenzia" });
    })
    .catch((error) => {
      console.error("Errore durante l'invio:", error);
    });
}
</script>
