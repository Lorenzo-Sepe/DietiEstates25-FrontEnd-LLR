<template>
  <DataTable v-if="ricerche && ricerche.length > 0"
    :value="ricerche"
    dataKey="id"
    sortField="dataRicerca"
    sortOrder="1"
    :rows="10"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    responsiveLayout="scroll"
    selectionMode="single"
    @rowSelect="onSelectRicerca"
  >
    <Column field="dataRicerca" header="Data Ricerca">
      <template #body="slotProps">
        {{ formatTimeAgo(slotProps.data.createdAt) }}
      </template>
    </Column>

    <Column field="Comune" header="Comune">
      <template #body="slotProps">
        {{
          slotProps.data.locality?.length === 1
            ? slotProps.data.locality[0]
            : slotProps.data.locality?.length
              ? slotProps.data.locality.join(", ")
              : "Italia"
        }}
      </template>
    </Column>

    <Column field="tipologiaImmobile" header="Tipologia">
      <template #body="slotProps">
        {{ slotProps.data.tipologiaImmobile ?? "Qualsiasi" }}
      </template>
    </Column>

    <Column field="tipologiaContratto" header="Contratto">
      <template #body="slotProps">
        {{ slotProps.data.tipologiaContratto ?? "Tutti" }}
      </template>
    </Column>


    <Column header="Azioni" :style="{ width: '120px', textAlign: 'center' }">
  <template #body="slotProps">
    <Button 
      icon="pi pi-info-circle" 
      class="p-button-text p-button-sm"
      @click="showDetails(slotProps.data)"
      tooltip="Mostra dettagli"
    />
  </template>
</Column>
  </DataTable>
  <div v-else>
    <p class="m-3 text-center">
      Non sono presenti ricerche salvate.
    </p>
  </div>
  <Dialog v-model:visible="dialogVisible" header="Dettagli Ricerca" :modal="true" :closable="true">
  <div v-if="selectedRicerca">
    <p><strong>Data:</strong> {{ formatTimeAgo(selectedRicerca.createdAt) }}</p>
    <p><strong>Comune:</strong> 
      {{ selectedRicerca.locality?.length === 1 
          ? selectedRicerca.locality[0] 
          : selectedRicerca.locality?.length 
            ? selectedRicerca.locality.join(", ") 
            : "Italia" }}
    </p>
    <p><strong>Tipologia Immobile:</strong> {{ selectedRicerca.tipologiaImmobile ?? "Qualsiasi" }}</p>
    <p><strong>Contratto:</strong> {{ selectedRicerca.tipologiaContratto ?? "Tutti" }}</p>
    <!--Altri filtri -->
    <div style="text-align: center; margin: 16px 0;">
    <h3 style="margin: 0; font-weight: bold;">Filtri Usati</h3>
    </div>
    <div v-for="(value, key) in JSON.parse(selectedRicerca.filtroUsatoJson)" :key="key">
      <template v-if="value !== null && value !== '' && value !== false && key!='locality' && key!='dataRicerca' && key!='tipologiaImmobile' && key!='tipologiaContratto' && key!='numeroPagina' && key!='numeroDiElementiPerPagina'">
       <span v-html="renderFiltro(key, value)"></span>
      </template>  
    </div>
  </div>
</Dialog>

</template>

<script setup>
import { defineProps,ref } from "vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const props = defineProps({
  ricerche: {
    type: Array,
    required: true,
  },
  onSelectRicerca: {
    type: Function,
    required: true,
  },
});
const selectedRicerca = ref(null);
const dialogVisible = ref(false);

function showDetails(ricerca) {
  selectedRicerca.value = ricerca;
  console.log("Dettagli ricerca selezionata:", ricerca);
  console.log(".filtroUsatoJson:", ricerca.filtroUsatoJson);
  dialogVisible.value = true;
}
function formatTimeAgo(dateArray) {
  if (!dateArray || dateArray.length < 3) return "---";
  const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);
  const now = new Date();

  const diffMs = now - date;
  if (diffMs < 0) return "---";

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear >= 1) return date.toLocaleDateString("it-IT");
  if (diffMonth >= 1) return diffMonth === 1 ? "un mese fa" : `${diffMonth} mesi fa`;
  if (diffWeek >= 1) return diffWeek === 1 ? "una settimana fa" : `${diffWeek} settimane fa`;
  if (diffDay >= 1) return diffDay === 1 ? "ieri" : `${diffDay} giorni fa`;
  if (diffHour >= 1) return diffHour === 1 ? "un'ora fa" : `${diffHour} ore fa`;
  if (diffMin >= 1) return diffMin === 1 ? "un minuto fa" : `${diffMin} minuti fa`;
  return "pochi secondi fa";
}

// Funzione che restituisce il contenuto da renderizzare
function renderFiltro(key, value) {
  if (value === null || value === '' || value === false) return null;

  // Chiavi da ignorare completamente
  const skipKeys = [
    'locality', 
    'dataRicerca', 
    'tipologiaImmobile', 
    'tipologiaContratto', 
    'numeroPagina', 
    'numeroDiElementiPerPagina',
    'ordineDataDesc',
    'provincia'
  ];
  if (skipKeys.includes(key)) return null;

  // Casi speciali
  if (key === 'postiAuto' && value === true) {
    return `<strong>Con posto auto</strong>`;
  }
  if (value === true) {
    return `<strong>Con ${formatKey(key)}</strong>`;
  }
  if( key=='prezzoMin'){
    return `<strong>Prezzo Minimo:</strong> ${value}€`;
  }
    if( key=='prezzoMax'){
        return `<strong>Prezzo Massimo:</strong> ${value}€`;
    }

  // Caso generico
  return `<strong>${formatKey(key)}:</strong> ${value}`;
}

// Trasforma chiavi camelCase in testo leggibile
function formatKey(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
} 
</script>
