<template>

  <!------------------------------------------------ DIALOGS  ---------------------------------------------------------->

  <Dialog v-model:visible="dialogCancellaAnnuncio" modal header="ATTENZIONE" :style="{ width: 'auto' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <p>L'annuncio verrà cancellato definitivamente senza possibilità di recupero</p>
    <div class="flex justify-end gap-2 my-4">
      <Button label="Annulla" severity="secondary" raised @click="dialogCancellaAnnuncio = false" />
      <Button label="Conferma" severity="success" raised @click="eliminaAnnuncio()" />
    </div>
  </Dialog>

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

  <!--------------------------------------------------- TABELLA ANNUNCI ------------------------------------------------------------->

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
          <Column field="titolo" header="Titolo">
            <template #body="slotProps">
              <span class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                @click="onTitoloClick(slotProps.data)">
                {{ slotProps.data.titolo }}
              </span>
            </template>
          </Column>
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
                <Button variant="text" rounded aria-label="Filter" @click="onClickModificaAnnuncio(slotProps.data.id)"
                  v-tooltip="{
                    value: 'Modifica annuncio',
                    showDelay: 300,
                    hideDelay: 300,
                  }">
                  <template #icon>
                    <i class="pi pi-file-edit w-5 h-5"></i>
                  </template>
                </Button>
                <Button variant="text" rounded aria-label="Filter" @click="onClickCancellaAnnuncio(slotProps.data.id)"
                  v-tooltip="{
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

              <div class="p-4">

                <Tag :value="'Proposte in trattative'" :severity="'warn'" class="mb-2" />

                <DataTable v-if="filterProposteInTrattativa(slotProps.data.proposte).length > 0"
                  :value="filterProposteInTrattativa(slotProps.data.proposte)">
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
                          class="hover:bg-[#008000]/60!" :disabled="slotProps.data.controproposta !== null" @click="
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
                          class="hover:bg-[#FFA500]/60!" :disabled="slotProps.data.controproposta !== null" v-tooltip="{
                            value: 'Fai una controproposta',
                            showDelay: 300,
                            hideDelay: 300,
                          }" @click="clickControproposta(slotProps.data)">
                          <template #icon>
                            <i class="pi pi-pencil w-5 h-5"></i>
                          </template>
                        </Button>
                        <Button v-if="props.isAgente" variant="text" rounded aria-label="Filter"
                          class="hover:bg-[#FF0000]/60!" :disabled="slotProps.data.controproposta !== null" v-tooltip="{
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

                <div v-else class="flex-grow flex items-center justify-center p-4">
                  <Tag value="Non ci sono proposte in trattativa per questo annuncio" severity="secondary"
                    class="w-full text-center h-10" />
                </div>

              </div>


              <div class="p-4">

                <Tag class="mb-2" :value="'Proposte accettate'" :severity="'success'" />

                <DataTable v-if="filterProposteAccettate(slotProps.data.proposte).length > 0"
                  :value="filterProposteAccettate(slotProps.data.proposte)">
                  <Column field="datiProponente.nome" header="Nome" sortable></Column>
                  <Column field="datiProponente.cognome" header="Cognome" sortable></Column>
                  <Column field="datiProponente.email" header="Email" sortable></Column>
                  <Column field="prezzoProposta" header="Proposta" sortable></Column>
                  <Column field="controproposta" header="Controproposta" sortable></Column>
                </DataTable>

                <div v-else class="flex-grow flex items-center justify-center p-4">
                  <Tag value="Non ci sono proposte accettate per questo annuncio" severity="secondary"
                    class="w-full text-center h-10" />
                </div>

              </div>

              <div class="p-4">

                <Tag class="mb-2" :value="'Proposte rifutate'" :severity="'danger'" />
                <DataTable v-if="filterProposteRifiutate(slotProps.data.proposte).length > 0"
                  :value="filterProposteRifiutate(slotProps.data.proposte)">
                  <Column field="datiProponente.nome" header="Nome" sortable></Column>
                  <Column field="datiProponente.cognome" header="Cognome" sortable></Column>
                  <Column field="datiProponente.email" header="Email" sortable></Column>
                  <Column field="prezzoProposta" header="Proposta" sortable></Column>
                  <Column field="controproposta" header="Controproposta" sortable></Column>
                </DataTable>

                <div v-else class="flex-grow flex items-center justify-center p-4">
                  <Tag value="Non ci sono proposte rifiutate per questo annuncio" severity="secondary"
                    class="w-full text-center h-10" />
                </div>

              </div>

            </div>

          </template>

        </DataTable>

      </div>

    </div>

    <Paginator :rows="5" :totalRecords="totaleAnnunci" :first="first" @page="onClickPage"></Paginator>

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
import Paginator from 'primevue/paginator';

import ScheletroTabella from "../PannelloStaff/ScheletroTabella.vue";
import FormControproposta from "./FormControproposta.vue";
import AggiungiPropostaManuale from "./AggiungiPropostaManuale.vue";

const props = defineProps([
  "propAnnunci",
  "propNumeroAnnunci",
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
  "onPage",
]);

const router = useRouter();

const dialogCancellaAnnuncio = ref(false);

const totaleAnnunci = computed(() => props.propNumeroAnnunci || 0);
const annunci = computed(() => props.propAnnunci || []);

const first = ref(0);

const expandedRows = ref([]);

const visible = ref(false);
const dialogControproposta = ref(false);
const propostaSelected = ref();
const selectedAnnuncioId = ref(null);

onMounted(() => { });

const isAnnunciEmpty = computed(() => {
  return annunci.value.length === 0;
});

const onTitoloClick = (annuncio) => {

  window.open(`/annuncio/${annuncio.id}`);
}

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

const onClickModificaAnnuncio = (idAnnuncio) => {

  router.push({
    path: `/PortaleAgenzia/ModificaAnnuncio/${idAnnuncio}`
  });
}

watch(() => props.propNumeroAnnunci,

  (newVal) => {

    first.value = 0;
  }
);

const onClickCancellaAnnuncio = (idAnnuncio) => {

  selectedAnnuncioId.value = idAnnuncio;

  dialogCancellaAnnuncio.value = true;

}

const eliminaAnnuncio = () => {

  dialogCancellaAnnuncio.value = false;

  emit("eliminaAnnuncio", selectedAnnuncioId.value);

}

const onClickPage = (event) => {

  emit("onPage", event.page + 1);

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
