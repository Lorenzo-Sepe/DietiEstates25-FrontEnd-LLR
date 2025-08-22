<template>
  <div class="p-6 space-y-6">
    <h2 class="text-xl font-bold">Crea Notifica Promozionale</h2>
    <!-- Oggetto -->
    <div class="field">
      <label class="font-semibold">Oggetto</label>
      <InputText
        v-model="form.oggetto"
        class="w-full"
        placeholder="Titolo della notifica"
      />
    </div>
    <!-- Contenuto con TipTap -->
    <div class="field">
      <label class="font-semibold">Contenuto</label>
      <MarkdownEditor v-model="form.contenuto" />
    </div>
    <!-- Area di interesse -->
    <div class="field">
      <label class="font-semibold">Area di interesse</label>
      <InputText
        v-model="form.criteriDiRicerca.areaDiInteresse"
        class="w-full"
      />
    </div>
    <!-- Tipo contratto -->
    <div class="field">
      <label class="font-semibold">Tipo di contratto</label>
      <Dropdown
        v-model="form.criteriDiRicerca.tipoDiContrattoDiInteresse"
        :options="contrattiOptions"
        optionLabel="label"
        optionValue="value"
        class="w-full"
      />
    </div>
    <!-- Tipo immobile -->
    <div class="field">
      <label class="font-semibold">Tipologia immobile</label>
      <Dropdown
        v-model="form.criteriDiRicerca.tipologiaDiImmobileDiInteresse"
        :options="immobiliOptions"
        optionLabel="label"
        optionValue="value"
        class="w-full"
      />
    </div>
    <!-- Budget -->
    <div class="flex gap-4">
      <div class="field flex-1">
        <label class="font-semibold">Budget Min</label>
        <InputNumber
          v-model="form.criteriDiRicerca.budgetMin"
          inputClass="w-full"
          mode="currency"
          currency="EUR"
        />
      </div>
      <div class="field flex-1">
        <label class="font-semibold">Budget Max</label>
        <InputNumber
          v-model="form.criteriDiRicerca.budgetMax"
          inputClass="w-full"
          mode="currency"
          currency="EUR"
        />
      </div>
    </div>
    <!-- Intervallo giorni -->
    <div class="field">
      <label class="font-semibold">Intervallo storico (giorni)</label>
      <InputNumber
        v-model="form.criteriDiRicerca.intervalloGiorniStoricoRicerca"
        inputClass="w-full"
      />
    </div>
    <!-- Pulsante -->
    <div class="flex justify-end gap-2">
      <Button label="Annulla" severity="secondary" />
      <Button label="Salva Notifica" icon="pi pi-save" @click="salvaNotifica" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";

// il tuo editor
import MarkdownEditor from "../components/MarkdownEditor.vue";

const contrattiOptions = [
  { label: "Affitto", value: "AFFITTO" },
  { label: "Vendita", value: "VENDITA" },
];

const immobiliOptions = [
  { label: "Appartamento", value: "APPARTAMENTO" },
  { label: "Villa", value: "VILLA" },
  { label: "Terreno", value: "TERRENO" },
];

const form = ref({
  contenuto: "",
  oggetto: "",
  criteriDiRicerca: {
    areaDiInteresse: "",
    tipoDiContrattoDiInteresse: "AFFITTO",
    tipologiaDiImmobileDiInteresse: "TERRENO",
    budgetMin: null,
    budgetMax: null,
    intervalloGiorniStoricoRicerca: null,
  },
});

function salvaNotifica() {
  console.log("Payload notifica:", form.value);
  // Qui chiamata API per salvarla
}
</script>
