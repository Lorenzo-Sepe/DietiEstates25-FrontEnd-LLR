<template>
  <div class="p-6 space-y-6">
    <h2 class="text-xl font-bold">Crea Notifica Promozionale</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Colonna Messaggio -->
      <div class="space-y-4 p-4 border rounded-2xl shadow-sm bg-white">
        <h3 class="text-lg font-semibold">Messaggio</h3>

        <!-- Oggetto -->
        <div class="field">
          <label class="font-semibold" for="oggetto-input">Oggetto</label>
          <InputText
            id="oggetto-input"
            v-model="form.oggetto"
            class="w-full"
            placeholder="Titolo della notifica"
          />
        </div>

        <!-- Contenuto con TipTap -->
        <div class="field">
          <label class="font-semibold" for="contenuto-editor">Contenuto</label>
          <MarkdownEditor id="contenuto-editor" v-model="form.contenuto" :contrastMode="true"/>
        </div>
      </div>

      <!-- Colonna Criteri di Ricerca -->
      <div class="space-y-4 p-4 border rounded-2xl shadow-sm bg-white">
        <h3 class="text-lg font-semibold">Criteri di Ricerca</h3>

        <!-- Area di interesse -->
        <div class="field">
          <label class="font-semibold" for="area-interesse-input">Area di interesse</label>
          <CitySelect 
            class="w-full mt-2"
            v-model:comune="form.criteriDiRicerca.areaDiInteresse"  
            placeholder="Seleziona la Città di Interesse">
          </CitySelect >
        </div>

        <!-- Tipo contratto -->
        <div class="field">
          <label class="font-semibold" for="tipo-contratto-dropdown">Tipo di contratto</label>
          <Dropdown
            id="tipo-contratto-dropdown"
            v-model="form.criteriDiRicerca.tipoDiContrattoDiInteresse"
            placeholder="Seleziona il tipo di contratto"
            :options="contrattiOptions"
            optionLabel="label"
            showClear
            optionValue="value"
            class="w-full"
          />
        </div>

        <!-- Tipo immobile -->
        <div class="field">
          <label class="font-semibold" for="tipologia-immobile-dropdown">Tipologia immobile</label>
          <Dropdown
            id="tipologia-immobile-dropdown"
            v-model="form.criteriDiRicerca.tipologiaDiImmobileDiInteresse"
            :options="immobiliOptions"
            placeholder="Seleziona la tipologia di immobile"
            optionLabel="label"
            optionValue="value"
            showClear
            class="w-full"
          />
        </div>

    <!-- Budget -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="font-semibold" for="budget-min-input">Budget Min</label>
            <InputNumber
              id="budget-min-input"
              v-model="form.criteriDiRicerca.budgetMin"
              inputClass="w-full"
              mode="currency"
              currency="EUR"
            />
          </div>
          <div>
            <label class="font-semibold" for="budget-max-input">Budget Max</label>
            <InputNumber
              id="budget-max-input"
              v-model="form.criteriDiRicerca.budgetMax"
              inputClass="w-full"
              mode="currency"
              currency="EUR"
            />
          </div>
        </div>
        <!-- Intervallo giorni -->
        <div class="field">
          <label class="font-semibold" for="intervallo-giorni-input">Intervallo storico </label>
          <i  
           v-tooltip.bottom="'Indica entro quanti giorni un utente deve aver effettuato una ricerca simile ai criteri che hai scelto'"
           class="pi pi-question-circle text-gray-500 cursor-pointer"
      
    ></i>
          <InputNumber
          showButtons 
            id="intervallo-giorni-input"
            v-model="form.criteriDiRicerca.intervalloGiorniStoricoRicerca"
            inputClass="w-full"
            suffix=" giorni"
            :min="1"
          />
        </div>

    

      </div>
    </div>

    <!-- Pulsanti -->
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
import CitySelect  from "../components/SelectZoneAreaDiinteresse.vue";

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
    areaDiInteresse: "Italia",
    tipoDiContrattoDiInteresse: "",
    tipologiaDiImmobileDiInteresse: "",
    budgetMin: null,
    budgetMax: null,
    intervalloGiorniStoricoRicerca: 7,
  },
});

function salvaNotifica(){

  NotificheService.creaNotifica(NotificaPromozionaleRequest)
    .then((response) => {
      router.push({ name: "PortaleAgenzia" });
    })
    .catch((error) => {
      console.error("Errore durante l'invio:", error);
    }
  )
}

</script>

<style scoped>
.field {
  width: 100%;
}
</style>