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
        {{ slotProps.data.tipologiaImmobile ?? "---" }}
      </template>
    </Column>

    <Column field="tipologiaContratto" header="Contratto">
      <template #body="slotProps">
        {{ slotProps.data.tipologiaContratto ?? "Tutti" }}
      </template>
    </Column>
  </DataTable>

  <div v-else>
    <p class="m-3 text-center">
      Non sono presenti ricerche salvate.
    </p>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
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
</script>
