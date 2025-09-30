<template>
  <div class="flex flex-col w-full h-full">
    <ScheletroTabella v-if="props.propLoading" class="flex-grow max-w-full" />
    <div v-else>
      <div v-if="isAnnunciEmpty" class="flex-grow flex items-center justify-center">
        <Tag value="Non ci sono annunci immobiliari per questo agente" severity="secondary"
          class="w-full text-center h-10" />
      </div>

      <div v-else class="flex-grow">
        <DataTable v-model:expandedRows="expandedRows" :value="annunci" dataKey="id"
          tableStyle="min-width: 100%; height: 100%;">
          <template #header>
            <div class="flex flex-wrap justify-start gap-2">
              <span class="font-bold text-xl">Annunci immobiliari</span>
            </div>
          </template>
          <Column expander style="width: 5rem" />
          <Column field="titolo" header="Titolo"></Column>
          <Column header="Copertina">
            <template #body="slotProps">
              <img :src="`${slotProps.data.immobile.immagini[0].url}`" :alt="'..'" class="shadow-lg" width="64" />
            </template>
          </Column>
          <Column header="Prezzo">
            <template #body="slotProps">
              <span v-if="slotProps.data.contratto.tipoContratto === 'VENDITA'">
                {{
                  slotProps.data.contratto.contrattoVenditaResponse
                    .prezzoVendita
                }}
                €
              </span>
              <span v-else>
                {{
                  slotProps.data.contratto.contrattoAffittoResponse
                    .prezzoAffitto
                }}
                €
              </span>
            </template>
          </Column>
          <Column field="contratto.tipoContratto" header="Contratto"></Column>
          <Column headerStyle="width:4rem">
            <template #body="slotProps">
              <div class="flex flex-row gap-2">
                <Button variant="text" rounded aria-label="Filter" @click="onClickModificaAnnuncio(slotProps.data.id)" v-tooltip="{
                  value: 'Modifica annuncio',
                  showDelay: 300,
                  hideDelay: 300,
                }">
                  <template #icon>
                    <i class="pi pi-file-edit w-5 h-5"></i>
                  </template>
                </Button>
                <Button variant="text" rounded aria-label="Filter" v-tooltip="{
                  value: 'Elimina annuncio',
                  showDelay: 300,
                  hideDelay: 300,
                }">
                  <template #icon>
                    <i class="pi pi-trash w-5 h-5"></i>
                  </template>
                </Button>
              </div>
            </template>
          </Column>

          <template #expansion="slotProps" class="proposte-in-trattativa">
            <div class="bg-gray-200">
              <div class="intestazione-proposte flex items-center justify-center p-4 gap-16">
                <h2>Gestione proposte</h2>
                <Button v-if="props.isAgente" label="Aggiungi proposta manuale"
                  @click="clickAggiungiPropostaManuale(slotProps.data.id)"></Button>
              </div>

              <div class="card flex justify-center">
                <Dialog v-model:visible="visible" :style="{ width: 'auto' }" header="Form proposta" :modal="true">
                  <AggiungiPropostaManuale :propostaRequest="props.propostaRequest" :idAnnuncio="selectedAnnuncioId"
                    @nuovaProposta="nuovaProposta" />
                </Dialog>
              </div>

              <div class="card flex justify-center">
                <Dialog v-model:visible="dialogControproposta" :style="{ width: 'auto' }" header="Form controproposta"
                  :modal="true">
                  <FormControproposta :proposta="propostaSelected" @controproposta="controproposta" />
                </Dialog>
              </div>

              <div class="p-4">
                <Tag :value="'Proposte in trattative'" :severity="'warn'" class="mb-2" />

                <DataTable :value="filterProposteInTrattativa(slotProps.data.proposte)">
                  <Column field="datiProponente.nome" header="Nome" sortable></Column>
                  <Column field="datiProponente.cognome" header="Cognome" sortable></Column>
                  <Column field="datiProponente.email" header="Email" sortable></Column>
                  <Column field="prezzoProposta" header="Proposta" sortable>
                    <template #body="slotProps">
                      <span :class="{
                        'line-through':
                          slotProps.data.controproposta !== null,
                      }">
                        {{ slotProps.data.prezzoProposta }}
                      </span>
                    </template>
                  </Column>
                  <Column field="controproposta" header="Controproposta" sortable></Column>
                  <Column headerStyle="width:4rem">
                    <template #body="slotProps">
                      <div class="flex flex-row gap-2">
                        <Button v-if="props.isAgente" variant="text" rounded aria-label="Filter"
                          class="hover:bg-[#008000]/60!" @click="
                            clickAccettaProposta(slotProps.data.idProposta)
                            " v-tooltip="{
                            value: 'Accetta la proposta',
                            showDelay: 300,
                            hideDelay: 300,
                          }">
                          <template #icon>
                            <i class="pi pi-check w-5 h-5"></i>
                          </template>
                        </Button>
                        <Button v-if="props.isAgente" variant="text" rounded aria-label="Filter"
                          class="hover:bg-[#FFA500]/60!" v-tooltip="{
                            value: 'Fai una controproposta',
                            showDelay: 300,
                            hideDelay: 300,
                          }" @click="clickControproposta(slotProps.data)">
                          <template #icon>
                            <i class="pi pi-pencil w-5 h-5"></i>
                          </template>
                        </Button>
                        <Button v-if="props.isAgente" variant="text" rounded aria-label="Filter"
                          class="hover:bg-[#FF0000]/60!" v-tooltip="{
                            value: 'Rifiuta proposta',
                            showDelay: 300,
                            hideDelay: 300,
                          }" @click="
                            clickRifiutaProposta(slotProps.data.idProposta)
                            ">
                          <template #icon>
                            <i class="pi pi-times w-5 h-5"></i>
                          </template>
                        </Button>
                      </div>
                    </template>
                  </Column>
                </DataTable>
              </div>

              <div class="p-4">
                <Tag class="mb-2" :value="'Proposte accettate'" :severity="'success'" />
                <DataTable :value="filterProposteAccettate(slotProps.data.proposte)">
                  <Column field="datiProponente.nome" header="Nome" sortable></Column>
                  <Column field="datiProponente.cognome" header="Cognome" sortable></Column>
                  <Column field="datiProponente.email" header="Email" sortable></Column>
                  <Column field="prezzoProposta" header="Proposta" sortable></Column>
                  <Column field="controproposta" header="Controproposta" sortable></Column>
                </DataTable>
              </div>

              <div class="p-4">
                <Tag class="mb-2" :value="'Proposte rifutate'" :severity="'danger'" />
                <DataTable :value="filterProposteRifiutate(slotProps.data.proposte)">
                  <Column field="datiProponente.nome" header="Nome" sortable></Column>
                  <Column field="datiProponente.cognome" header="Cognome" sortable></Column>
                  <Column field="datiProponente.email" header="Email" sortable></Column>
                  <Column field="prezzoProposta" header="Proposta" sortable></Column>
                  <Column field="controproposta" header="Controproposta" sortable></Column>
                </DataTable>
              </div>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch, computed } from "vue";
import { useRouter } from "vue-router";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Dialog from "primevue/dialog";

import ScheletroTabella from "../PannelloStaff/ScheletroTabella.vue";
import FormControproposta from "./FormControproposta.vue";
import AggiungiPropostaManuale from "./AggiungiPropostaManuale.vue";

const props = defineProps([
  "propAnnunci",
  "propLoading",
  "propostaRequest",
  "agente",
  "isAgente",
]);
const emit = defineEmits([
  "nuovaProposta",
  "eliminaProposta",
  "accettaProposta",
  "controproposta",
]);

const router = useRouter();

const annunci = ref([]);

const expandedRows = ref([]);

const visible = ref(false);
const dialogControproposta = ref(false);
const propostaSelected = ref();
const selectedAnnuncioId = ref(null);

onMounted(() => { });

const isAnnunciEmpty = computed(() => {
  return annunci.value.length === 0;
});

const filterProposteAccettate = (proposte) => {
  return proposte
    ? proposte.filter((proposta) => proposta.stato === "ACCETTATO")
    : [];
};

const filterProposteRifiutate = (proposte) => {
  return proposte
    ? proposte.filter((proposta) => proposta.stato === "RIFIUTATO")
    : [];
};

const filterProposteInTrattativa = (proposte) => {
  return proposte
    ? proposte.filter((proposta) => proposta.stato === "IN_TRATTAZIONE")
    : [];
};

const clickAggiungiPropostaManuale = (id) => {
  selectedAnnuncioId.value = id;
  visible.value = true;
};

const nuovaProposta = () => {
  visible.value = false;

  emit("nuovaProposta");
};

const clickControproposta = (proposta) => {
  dialogControproposta.value = true;
  propostaSelected.value = proposta;
};

const clickRifiutaProposta = (id) => {
  emit("eliminaProposta", id);
};

const clickAccettaProposta = (idProposta) => {
  emit("accettaProposta", idProposta);
};

const controproposta = (idProposta, controproposta) => {
  dialogControproposta.value = false;
  emit("controproposta", idProposta, controproposta);
};

const controPropostaAbilitato = (proposta) => {
  return proposta.controproposta === null;
};

watch(
  () => props.propAnnunci,
  (newAnnunci) => {
    annunci.value = newAnnunci; // Copia "sicura"
  },
  { immediate: true },
);


const onClickModificaAnnuncio = (idAnnuncio) => {

  router.push({ 
    path: `/PortaleAgenzia/ModificaAnnuncio/${idAnnuncio}`
   });
}

</script>

<style>
/* Togliamo i bordi verticali tra colonne */
.p-datatable td,
.p-datatable th {
  border-left: none !important;
  border-right: none !important;
}

/* Mostriamo solo i bordi sopra e sotto delle celle */
.p-datatable td {
  border-top: 1px solid black !important;
  border-bottom: 1px solid black !important;
}

/* Togliamo i bordi intorno alla tabella */
.p-datatable table {
  border: none !important;
  border-collapse: collapse;
}
</style>
