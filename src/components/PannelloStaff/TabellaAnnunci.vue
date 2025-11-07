<template>
  <!------------------------------------------------ DIALOGS GENERALI ---------------------------------------------------------->

  <!-- Dialog cancellazione annuncio -->
  <Dialog
    v-model:visible="dialogCancellaAnnuncio"
    modal
    header="ATTENZIONE"
    class="uniform-dialog"
    :dismissable-mask="true"
  >
    <p>L'annuncio verrà cancellato definitivamente senza possibilità di recupero.</p>
    <div class="flex justify-end gap-2 my-4">
      <Button label="Annulla" severity="secondary" raised @click="dialogCancellaAnnuncio = false" />
      <Button label="Conferma" severity="danger" raised @click="eliminaAnnuncio()" />
    </div>
  </Dialog>

  <!-- Dialog accettazione proposta -->
  <Dialog
    v-model:visible="dialogAccettaProposta"
    modal
    header="Conferma accettazione"
    class="uniform-dialog"
    :dismissable-mask="true"
  >
    <p class="text-gray-700">
      Sei sicuro di voler <b>accettare</b> la proposta di
      <b>{{ propostaSelezionata?.datiProponente?.nome }} {{ propostaSelezionata?.datiProponente?.cognome }}</b>
      per un importo di <b>{{ formatPrezzo(propostaSelezionata?.prezzoProposta) }}</b>?
    </p>
    <div class="flex justify-end gap-2 my-4">
      <Button label="Annulla" severity="secondary" raised @click="dialogAccettaProposta = false" />
      <Button label="Conferma" severity="success" raised @click="confermaAccettazione()" />
    </div>
  </Dialog>

  <!-- Dialog rifiuto proposta -->
  <Dialog
    v-model:visible="dialogRifiutaProposta"
    modal
    header="Conferma rifiuto"
    class="uniform-dialog"
    :dismissable-mask="true"
  >
    <p class="text-gray-700">
      Sei sicuro di voler <b>rifiutare</b> la proposta di
      <b>{{ propostaSelezionata?.datiProponente?.nome }} {{ propostaSelezionata?.datiProponente?.cognome }}</b>
      per un importo di <b>{{ formatPrezzo(propostaSelezionata?.prezzoProposta) }}</b>?
    </p>
    <div class="flex justify-end gap-2 my-4">
      <Button label="Annulla" severity="secondary" raised @click="dialogRifiutaProposta = false" />
      <Button label="Conferma" severity="danger" raised @click="confermaRifiuto()" />
    </div>
  </Dialog>

  <!-- Dialog aggiunta proposta manuale -->
  <Dialog v-model:visible="visible" header="Form proposta" class="uniform-dialog" :dismissable-mask="true">
    <AggiungiPropostaManuale
      :propostaRequest="props.propostaRequest"
      :idAnnuncio="selectedAnnuncioId"
      @nuovaProposta="nuovaProposta"
    />
  </Dialog>

  <!-- Dialog controproposta -->
  <Dialog v-model:visible="dialogControproposta" header="Form controproposta" class="uniform-dialog" :dismissable-mask="true">
    <FormControproposta :proposta="propostaSelected" @controproposta="controproposta" />
  </Dialog>

  <!--------------------------------------------------- TABELLA ANNUNCI ------------------------------------------------------------->

  <div class="flex flex-col w-full h-full">
    <ScheletroTabella v-if="props.propLoading" class="flex-grow max-w-full" />

    <div v-else>
      <div v-if="isAnnunciEmpty" class="flex-grow flex items-center justify-center">
        <Tag
          value="Non ci sono annunci immobiliari per questo agente"
          severity="secondary"
          class="w-full text-center h-10"
        />
      </div>

      <div v-else class="flex-grow">
        <DataTable v-model:expandedRows="expandedRows" :value="annunci" dataKey="id" tableStyle="min-width: 100%">
          <template #header>
            <div class="flex flex-wrap justify-start gap-2">
              <span class="font-bold text-xl">Annunci immobiliari</span>
            </div>
          </template>

          <Column expander style="width: 5rem" />
          <Column field="titolo" header="Titolo">
            <template #body="slotProps">
              <span
                class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                @click="onTitoloClick(slotProps.data)"
              >
                {{ slotProps.data.titolo }}
              </span>
            </template>
          </Column>

          <Column header="Copertina">
            <template #body="slotProps">
              <img :src="`${slotProps.data.immobile.immagini[0].url}`" alt="Copertina" class="shadow-lg" width="64" />
            </template>
          </Column>

          <Column header="Prezzo">
            <template #body="slotProps">
              <span v-if="slotProps.data.contratto.tipoContratto === 'VENDITA'">
                {{ slotProps.data.contratto.contrattoVenditaResponse.prezzoVendita }} €
              </span>
              <span v-else>
                {{ slotProps.data.contratto.contrattoAffittoResponse.prezzoAffitto }} €
              </span>
            </template>
          </Column>

          <Column field="contratto.tipoContratto" header="Contratto" />

          <Column headerStyle="width:4rem">
            <template #body="slotProps">
              <div class="flex flex-row gap-2">
                <Button
                  variant="text"
                  rounded
                  aria-label="Modifica"
                  @click="onClickModificaAnnuncio(slotProps.data.id)"
                  v-tooltip="{ value: 'Modifica annuncio', showDelay: 300, hideDelay: 300 }"
                >
                  <template #icon><i class="pi pi-file-edit w-5 h-5"></i></template>
                </Button>
                <Button
                  variant="text"
                  rounded
                  aria-label="Elimina"
                  @click="onClickCancellaAnnuncio(slotProps.data.id)"
                  v-tooltip="{ value: 'Elimina annuncio', showDelay: 300, hideDelay: 300 }"
                >
                  <template #icon><i class="pi pi-trash w-5 h-5"></i></template>
                </Button>
              </div>
            </template>
          </Column>

          <!-- Espansione con proposte -->
          <template #expansion="slotProps">
            <div class="bg-gray-200 p-4 space-y-8">
              <div class="intestazione-proposte flex items-center justify-between p-2">
                <h2 class="font-semibold">Gestione proposte</h2>
                <Button
                  v-if="props.isAgente"
                  label="Aggiungi proposta manuale"
                  @click="clickAggiungiPropostaManuale(slotProps.data.id)"
                />
              </div>

              <div class="p-4">

                <Tag :value="'Proposte in trattative'" :severity="'warn'" class="mb-2" />

                <DataTable v-if="filterProposteInTrattativa(slotProps.data.proposte).length > 0"
                  :value="filterProposteInTrattativa(slotProps.data.proposte)">
                  <Column field="datiProponente.nome" header="Nome" sortable></Column>
                  <Column field="datiProponente.cognome" header="Cognome" sortable></Column>
                  <Column header="Contatto" sortable>
                    <template #body="{ data }">
                      {{ data.datiProponente.contatto.tipo }}: {{ data.datiProponente.contatto.valore }}
                    </template>
                  </Column>
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
                    <template #body="p">
                      <div class="flex flex-row gap-2">
                        <Button
                          v-if="props.isAgente"
                          variant="text"
                          rounded
                          aria-label="Accetta"
                          class="hover:bg-green-200"
                          @click="openDialogAccetta(p.data)"
                          v-tooltip="{ value: 'Accetta la proposta' }"
                        >
                          <template #icon><i class="pi pi-check w-5 h-5"></i></template>
                        </Button>
                        <Button
                          v-if="props.isAgente"
                          variant="text"
                          rounded
                          aria-label="Controproposta"
                          class="hover:bg-yellow-200"
                          :disabled="p.data.controproposta !== null"
                          @click="clickControproposta(p.data)"
                          v-tooltip="{ value: 'Fai una controproposta' }"
                        >
                          <template #icon><i class="pi pi-pencil w-5 h-5"></i></template>
                        </Button>
                        <Button
                          v-if="props.isAgente"
                          variant="text"
                          rounded
                          aria-label="Rifiuta"
                          class="hover:bg-red-200"
                          @click="openDialogRifiuta(p.data)"
                          v-tooltip="{ value: 'Rifiuta proposta' }"
                        >
                          <template #icon><i class="pi pi-times w-5 h-5"></i></template>
                        </Button>
                      </div>
                    </template>
                  </Column>
                </DataTable>

                <div v-else class="flex-grow flex items-center justify-center p-4">
                  <Tag value="Non ci sono proposte in trattativa" severity="secondary" class="w-full text-center h-10" />
                </div>
              </div>


              <div class="p-4">

                <Tag class="mb-2" :value="'Proposte accettate'" :severity="'success'" />

                <DataTable v-if="filterProposteAccettate(slotProps.data.proposte).length > 0"
                  :value="filterProposteAccettate(slotProps.data.proposte)">
                  <Column field="datiProponente.nome" header="Nome" sortable></Column>
                  <Column field="datiProponente.cognome" header="Cognome" sortable></Column>
                  <Column header="Contatto" sortable>
                    <template #body="{ data }">
                      {{ data.datiProponente.contatto.tipo }}: {{ data.datiProponente.contatto.valore }}
                    </template>
                  </Column>
                  <Column field="prezzoProposta" header="Proposta" sortable></Column>
                  <Column field="controproposta" header="Controproposta" sortable></Column>
                </DataTable>
                <div v-else class="flex-grow flex items-center justify-center p-4">
                  <Tag value="Nessuna proposta accettata" severity="secondary" class="w-full text-center h-10" />
                </div>
              </div>

              <div class="p-4">

                <Tag class="mb-2" :value="'Proposte rifutate'" :severity="'danger'" />
                <DataTable v-if="filterProposteRifiutate(slotProps.data.proposte).length > 0"
                  :value="filterProposteRifiutate(slotProps.data.proposte)">
                  <Column field="datiProponente.nome" header="Nome" sortable></Column>
                  <Column field="datiProponente.cognome" header="Cognome" sortable></Column>
                  <Column header="Contatto" sortable>
                    <template #body="{ data }">
                      {{ data.datiProponente.contatto.tipo }}: {{ data.datiProponente.contatto.valore }}
                    </template>
                  </Column>
                  <Column field="prezzoProposta" header="Proposta" sortable></Column>
                  <Column field="controproposta" header="Controproposta" sortable></Column>
                </DataTable>
                <div v-else class="flex-grow flex items-center justify-center p-4">
                  <Tag value="Nessuna proposta rifiutata" severity="secondary" class="w-full text-center h-10" />
                </div>
              </div>
            </div>
          </template>
        </DataTable>
      </div>
    </div>

    <Paginator :rows="5" :totalRecords="totaleAnnunci" :first="first" @page="onClickPage" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Dialog from "primevue/dialog";
import Paginator from "primevue/paginator";

import ScheletroTabella from "../PannelloStaff/ScheletroTabella.vue";
import FormControproposta from "./FormControproposta.vue";
import AggiungiPropostaManuale from "./AggiungiPropostaManuale.vue";

const props = defineProps(["propAnnunci", "propNumeroAnnunci", "propLoading", "propostaRequest", "agente", "isAgente"]);
const emit = defineEmits(["nuovaProposta", "eliminaProposta", "accettaProposta", "controproposta", "onPage", "eliminaAnnuncio"]);

const router = useRouter();

// dialog refs
const dialogCancellaAnnuncio = ref(false);
const dialogAccettaProposta = ref(false);
const dialogRifiutaProposta = ref(false);
const dialogControproposta = ref(false);
const visible = ref(false);

// selection
const propostaSelezionata = ref(null); // contiene l'oggetto proposta selezionata (nome, prezzo, ecc)
const propostaSelected = ref();
const selectedAnnuncioId = ref(null);
const selectedPropostaId = ref(null);

// table data
const totaleAnnunci = computed(() => props.propNumeroAnnunci || 0);
const annunci = computed(() => props.propAnnunci || []);
const first = ref(0);
const expandedRows = ref([]);
const isAnnunciEmpty = computed(() => annunci.value.length === 0);

// helpers
const formatPrezzo = (val) => {
  if (val == null) return "";
  // formattazione semplice (puoi usare Intl.NumberFormat se vuoi)
  return new Intl.NumberFormat('it-IT').format(val) + " €";
};

// navigation
const onTitoloClick = (annuncio) => window.open(`/annuncio/${annuncio.id}`);
const onClickModificaAnnuncio = (idAnnuncio) => router.push({ path: `/PortaleAgenzia/ModificaAnnuncio/${idAnnuncio}` });

// proposals
const filterProposteAccettate = (p) => (p ? p.filter((x) => x.stato === "ACCETTATO") : []);
const filterProposteRifiutate = (p) => (p ? p.filter((x) => x.stato === "RIFIUTATO") : []);
const filterProposteInTrattativa = (p) => (p ? p.filter((x) => x.stato === "IN_TRATTAZIONE") : []);

const clickAggiungiPropostaManuale = (id) => {
  selectedAnnuncioId.value = id;
  visible.value = true;
};
const nuovaProposta = () => {
  visible.value = false;
  emit("nuovaProposta");
};

const clickControproposta = (proposta) => {
  propostaSelected.value = proposta;
  dialogControproposta.value = true;
};
const controproposta = (idProposta, controproposta) => {
  dialogControproposta.value = false;
  emit("controproposta", idProposta, controproposta);
};

// **IMPORTANTE**: qui riceviamo l'oggetto proposta (non solo l'id)
const openDialogAccetta = (proposta) => {
  propostaSelezionata.value = proposta;
  selectedPropostaId.value = proposta.idProposta ?? proposta.id ?? null;
  dialogAccettaProposta.value = true;
};
const openDialogRifiuta = (proposta) => {
  propostaSelezionata.value = proposta;
  selectedPropostaId.value = proposta.idProposta ?? proposta.id ?? null;
  dialogRifiutaProposta.value = true;
};

const confermaAccettazione = () => {
  dialogAccettaProposta.value = false;
  emit("accettaProposta", selectedPropostaId.value);
};
const confermaRifiuto = () => {
  dialogRifiutaProposta.value = false;
  emit("eliminaProposta", selectedPropostaId.value);
};

const onClickCancellaAnnuncio = (idAnnuncio) => {
  selectedAnnuncioId.value = idAnnuncio;
  dialogCancellaAnnuncio.value = true;
};
const eliminaAnnuncio = () => {
  dialogCancellaAnnuncio.value = false;
  emit("eliminaAnnuncio", selectedAnnuncioId.value);
};

const onClickPage = (event) => emit("onPage", event.page + 1);

watch(() => props.propNumeroAnnunci, () => (first.value = 0));
</script>

<!-- GLOBAL styles: NON scoped, per applicare correttamente a PrimeVue Dialog -->
<style>
/* .uniform-dialog verrà applicata al root del Dialog.
   I selettori sottostanti puntano agli elementi interni di PrimeVue */

/* larghezza uniforme e responsive */
.uniform-dialog .p-dialog {
  width: 520px !important;
  max-width: 92vw !important;
  border-radius: 0.75rem !important; /* rounded-lg */
}

/* contenuto interno padding */
.uniform-dialog .p-dialog-content {
  padding: 1.25rem !important; /* p-5 */
}

/* header styling */
.uniform-dialog .p-dialog-header {
  padding: 0.75rem 1.25rem !important; /* py-3 px-5 */
  font-weight: 600;
}

/* footer (bottoni) */
.uniform-dialog .p-dialog-footer {
  padding: 0.75rem 1.25rem !important;
}

/* se vuoi forzare il body del dialog ad usare flex column */
.uniform-dialog .p-dialog-content > * {
  margin-bottom: 0.5rem;
}

/* mantenere stili visual coerenti con tailwind utility */
.uniform-dialog .p-dialog .p-button {
  border-radius: 0.5rem;
}
</style>
