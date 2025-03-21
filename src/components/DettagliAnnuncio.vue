<template>
  <div class="dettagli-annuncio flex flex-col items-center w-full">
    <Card class="mb-4 w-full bg-surface-50 lg:w-[50%]">
      <template #title>
        <div class="flex flex-row items-center justify-between h-20 bg-surface-50 p-2 rounded border border-surface-100">
          <h2>{{ annuncio.titolo }}</h2>
          <Tag :value="annuncio.contratto.tipoContratto" severity="info" />
        </div>
      </template>
      <template #content>
        <div class="flex flex-col items-center justify-between">
          <div class="flex-1 w-full md:flex-2">
            <Carosello :galleria="annuncio.immobile.immagini" />
          </div>
        </div>
      </template>
    </Card>

    <div class="flex flex-col items-center justify-between gap-1 mx-5 my-2 lg:flex-row lg:justify-center lg:items-start lg:flex-wrap">
      <div class="flex flex-row w-full gap-3 lg:w-[50%]">
        <Card class="mb-4 w-full bg-surface-50">
          <template #title>
            <div class="flex items-center h-20 bg-surface-50 p-2 rounded border border-surface-100 m-[-0.5em]">Dettagli Annuncio</div>
          </template>
          <template #content>
            <div class="flex flex-col items-start justify-center flex-wrap gap-5">
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-1">
                  <span class="font-bold text-2xl">Prezzo:</span>
                  <div v-if="annuncio.contratto.tipoContratto === 'VENDITA'" class="font-bold text-2xl">
                    €{{ annuncio.contratto.contrattoVenditaResponse.prezzoVendita.toLocaleString() }}
                  </div>
                  <div v-if="annuncio.contratto.tipoContratto === 'AFFITTO'" class="font-bold text-2xl">
                    €{{ annuncio.contratto.contrattoAffittoResponse.prezzoAffitto.toLocaleString() }}/mese
                  </div>
                </div>
                <div class="flex items-center gap-1">
                  <i class="pi pi-home"></i>
                  <span>Tipologia: {{ annuncio.immobile.tipologiaImmobile }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <i class="bi bi-rulers"></i>
                  <span>Metri quadri: {{ annuncio.immobile.metriQuadri }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <i class="bi bi-border-outer"></i>
                  <span>Stanze: {{ annuncio.immobile.numeroStanze }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <i class="pi pi-building"></i>
                  <span>Numero Piani: {{ annuncio.immobile.numeroDiPiani }}</span>
                </div>
              </div>
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-1">
                  <i class="pi pi-bolt"></i>
                  <span>Classe Energetica: {{ annuncio.immobile.classeEnergetica.replace('PLUS', '+').replace('MINUS', '-').replace('_', '') }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <i class="bi bi-badge-wc"></i>
                  <span>Bagni: {{ annuncio.immobile.numeroServizi }}</span>
                </div>
              </div>
            </div>
          </template>
        </Card>
        <Card class="mb-4 w-full bg-surface-50">
          <template #title>
            <div class="flex items-center h-20 bg-surface-50 p-2 rounded border border-surface-100 m-[-0.5em]">Indirizzo</div>
          </template>
          <template #content>
            <div class="flex flex-wrap gap-3">
              <div class="flex items-center w-full gap-1">
                <i class="pi pi-map-marker"></i>
                <span>{{ annuncio.immobile.indirizzo.via }} {{ annuncio.immobile.indirizzo.numeroCivico }}</span>
              </div>
              <div class="flex items-center gap-1">
                <i class="pi pi-building"></i>
                <span>{{ annuncio.immobile.indirizzo.citta }} ({{ annuncio.immobile.indirizzo.provincia }})</span>
              </div>
              <div class="flex items-center gap-1">
                <i class="pi pi-globe"></i>
                <span>{{ annuncio.immobile.indirizzo.cap }} - {{ annuncio.immobile.indirizzo.nazione }}</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <Panel class="w-full bg-surface-50 lg:w-[50%]">
        <template #header>
          <span class="p-2 text-2xl font-bold">Descrizione</span>
        </template>
        <p class="line-height-3">{{ annuncio.descrizione }}</p>
      </Panel>

      <Accordion :multiple="true" class="w-full lg:w-[50%]">
        <AccordionPanel value="1">
          <AccordionHeader>Caratteristiche Aggiuntive</AccordionHeader>
          <AccordionContent>
            <ul class="items-start">
              <li v-if="annuncio.immobile.caratteristicheAggiuntive.balconi">Balconi</li>
              <li v-if="annuncio.immobile.caratteristicheAggiuntive.garage">Garage</li>
              <li v-if="annuncio.immobile.caratteristicheAggiuntive.postiAuto">Posti Auto</li>
              <li v-if="annuncio.immobile.caratteristicheAggiuntive.giardino">Giardino</li>
              <li v-if="annuncio.immobile.caratteristicheAggiuntive.ascensore">Ascensore</li>
              <li v-if="annuncio.immobile.caratteristicheAggiuntive.portiere">Portiere</li>
              <li v-if="annuncio.immobile.caratteristicheAggiuntive.riscaldamentoCentralizzato">Riscaldamento Centralizzato</li>
              <li v-if="annuncio.immobile.caratteristicheAggiuntive.climatizzatori">Climatizzatori</li>
              <li v-if="annuncio.immobile.caratteristicheAggiuntive.pannelliSolari">Pannelli Solari</li>
            </ul>
            <ul class="items-start">
              <li v-for="luogo in annuncio.immobile.indirizzo.vicinoA" :key="luogo">Vicino a {{ luogo.charAt(0).toUpperCase() + luogo.slice(1).toLowerCase().replace('_', ' ') }}</li>
            </ul>
            <div v-if="annuncio.immobile.caratteristicheAggiuntive.campoExtra">
              {{ annuncio.immobile.caratteristicheAggiuntive.campoExtra }}
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>

      <BusinessCard :agente="annuncio.agente" class="mb-4 w-full  lg:w-[50%]"/>

      

      <Card v-if="annuncio.contratto.tipoContratto === 'AFFITTO'" class="w-full bg-surface-50 lg:w-[50%]">
        <template #title>
          <div class="flex items-center h-20 bg-surface-50 p-2 rounded border border-surface-100 m-[-0.5em]">Dettagli Affitto</div>
        </template>
        <template #content>
          <div class="flex flex-column gap-1">
            <div class="flex items-center gap-1">
              <i class="pi pi-calendar"></i>
              <span>Durata: {{ annuncio.contratto.contrattoAffittoResponse.tempoMinimo }} - {{ annuncio.contratto.contrattoAffittoResponse.tempoMassimo }} mesi</span>
            </div>
            <div class="flex items-center gap-1">
              <i class="pi pi-wallet"></i>
              <span>Caparra: €{{ annuncio.contratto.contrattoAffittoResponse.caparra.toLocaleString() }}</span>
            </div>
          </div>
        </template>
      </Card>

      <Card class="mb-4 w-full bg-surface-50 lg:w-[50%]">
        <template #title>
          <div class="flex items-center h-20 bg-surface-50 p-2 rounded border border-surface-100 m-[-0.5em]">Proposte</div>
        </template>
        <template #content>
          <DataTable stripedRows tableStyle="width: 100%" :value="annuncio.proposte" responsiveLayout="scroll" class="rounded border border-surface-100">
            <Column field="prezzoProposta" header="Prezzo Proposta">
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.prezzoProposta) }}
              </template>
            </Column>
            <Column field="controproposta" header="Controproposta">
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.controproposta) }}
              </template>
            </Column>
            <Column field="stato" header="Stato">
              <template #body="slotProps">
                <Tag :value="slotProps.data.stato.charAt(0).toUpperCase() + slotProps.data.stato.slice(1)" :severity="getSeverity(slotProps.data)" />
              </template>
            </Column>
            <Column field="datiProponente.nome" header="Nome Proponente">
              <template #body="slotProps">
                {{ slotProps.data.datiProponente.nome.charAt(0).toUpperCase() + slotProps.data.datiProponente.nome.slice(1) }}
              </template>
            </Column>
            <Column field="datiProponente.cognome" header="Cognome Proponente">
              <template #body="slotProps">
                {{ slotProps.data.datiProponente.cognome.charAt(0).toUpperCase() + slotProps.data.datiProponente.cognome.slice(1) }}
              </template>
            </Column>
            <Column field="datiProponente.contatto.tipo" header="Tipo Contatto">
              <template #body="slotProps">
                {{ slotProps.data.datiProponente.contatto.tipo.charAt(0).toUpperCase() + slotProps.data.datiProponente.contatto.tipo.slice(1) }}
              </template>
            </Column>
            <Column field="datiProponente.contatto.valore" header="Valore Contatto"></Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>


<script setup>
import { defineProps, ref } from 'vue';
import { AnnuncioImmobiliareResponse } from '../dto/Response/AnnuncioImmobiliareResponse';
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import Carosello from './Carosello.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Panel from 'primevue/panel';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import BusinessCard from './BusinessCard.vue';

const props = defineProps({
  annuncio: {
    type: Object,
    required: true,
    default: () => new AnnuncioImmobiliareResponse(),
  },
});

const responsiveOptions = ref([
  {
    breakpoint: '1300px',
    numVisible: 4,
  },
  {
    breakpoint: '575px',
    numVisible: 1,
  },
]);

const formatCurrency = (value) => {
  if (!value) return '';
  return `€${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
};

const getSeverity = (proposta) => {
  switch (proposta.stato.toLowerCase()) {
    case 'accettata':
      return 'success';
    case 'rifiutata':
      return 'danger';
    case 'in attesa':
      return 'warn';
    default:
      return 'info';
  }
};
</script>

<style scoped>
.dettagli-annuncio {
  padding: 2rem;
}

:deep(.p-card-title) {
  padding: 1rem;
  margin: -1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
}
:deep(.p-galleria) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.p-galleria-item) {
  border-radius: 8px;
}

:deep(.p-avatar) {
  border: 2px solid var(--primary-color);
}
</style>
