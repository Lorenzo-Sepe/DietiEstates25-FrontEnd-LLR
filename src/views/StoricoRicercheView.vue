<template>
    <div class="p-4">
        <h2>Storico Ricerche</h2>
        <DataTable :value="storicoRicerche" :paginator="true" :rows="10" responsiveLayout="scroll">
            <Column field="dataRicerca" header="Data Ricerca" :sortable="true" />
            <Column
                v-for="(valore, filtro) in filtriColonne"
                :key="filtro"
                :field="filtro"
                :header="filtro"
                :sortable="true"
            />
        </DataTable>
    </div>
</template>

<script setup>
import { ref, computed,onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// Esempio di dati mock
const storicoRicerche = ref([
    {
        dataRicerca: '2024-06-01 10:23',
        Località: 'Milano',
        PrezzoMin: 200000,
        PrezzoMax: 400000,
        Tipologia: 'Appartamento'
    },
    {
        dataRicerca: '2024-06-02 15:45',
        Località: 'Roma',
        PrezzoMin: 150000,
        PrezzoMax: 350000,
        Tipologia: 'Villa'
    }
])

// Calcola dinamicamente le colonne dei filtri (escludendo dataRicerca)
const filtriColonne = computed(() => {
    if (storicoRicerche.value.length === 0) return {}
    const { dataRicerca, ...filtri } = storicoRicerche.value[0]
    return filtri
})
</script>

<style scoped>
.p-4 {
    max-width: 900px;
    margin: auto;
}
</style>