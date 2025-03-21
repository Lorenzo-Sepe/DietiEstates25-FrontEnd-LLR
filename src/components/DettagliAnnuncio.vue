<template>
  <div class="dettagli-annuncio flex items-center flex-col w-full">
    <Card class="mb-4 w-full lg:w-[50%]">
      <template #title>
        <div class="flex flex-row items-center justify-between">
          <h2>{{ annuncio.titolo }}</h2>
          <Tag :value="annuncio.contratto.tipoContratto" severity="info" />
        </div>
      </template>
      <template #content>
        <div class="flex justify-between flex-col  items-center">
          <div class="flex-1 md:flex-2 w-full">
            <Galleria :value="annuncio.immobile.immagini" 
                      :numVisible="5" 
                      :circular="true"  
                      :showThumbnails="true" 
                      :responsiveOptions="responsiveOptions" 
                      :showItemNavigators="true" 
                      :showItemNavigatorsOnHover="true"
                      :showIndicators="false"
                      class="mb-4 w-full">
              <template #item="slotProps">
                <img :src="slotProps.item.url" 
                      :alt="slotProps.item.descrizione" 
                      style="width: 100%; 
                      display: block" />  
              </template>
              <template #thumbnail="slotProps">
                <div class="items-center">
                  <img :src="slotProps.item.url" 
                      :alt="slotProps.item.descrizione" 
                      style="display: block;width: 20%"/>
                </div>
              </template>
              <template #caption="slotProps">
                <p>{{ slotProps.item.descrizione }}</p>
              </template>
            </Galleria>
          </div>
          <div class="flex-1 md:flex-1">
            <div class="surface-0 p-4 border-round">
              <h2 class="text-xl mb-3">Prezzo</h2>
              <div v-if="annuncio.contratto.tipoContratto === 'VENDITA'" class="text-2xl font-bold text-primary">
                €{{ annuncio.contratto.contrattoVenditaResponse.prezzoVendita.toLocaleString() }}
              </div>
              <div v-if="annuncio.contratto.tipoContratto === 'AFFITTO'"" class="text-2xl font-bold text-primary">
                €{{ annuncio.contratto.contrattoAffittoResponse.prezzoAffitto.toLocaleString() }}/mese
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <div class="flex flex-col lg:flex-row lg:justify-center lg:items-start lg:flex-wrap justify-between gap-1 items-center mx-5 my-2">
      
        <div class="flex flex-row  gap-3 w-full lg:w-[50%]">
          <Card class="mb-4 w-full">
          <template #title>Dettagli Immobile</template>
          <template #content>
            <div class="flex flex-col flex-wrap gap-5 items-start justify-center ">
              <div class="flex flex-col gap-3">
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
                  <span>Classe Energetica: {{ annuncio.immobile.classeEnergetica.replace('PLUS', '+').replace('PLUS', '+').replace('MINUS', '-').replace('MINUS', '-').replace('_', '').replace('_', '') }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <i class=" bi-badge-wc"></i>
                  <span>Bagni: {{ annuncio.immobile.numeroServizi }}</span>
                </div>
              </div>
            </div>
          </template>
        </Card>
        <Card class="mb-4 w-full">
          <template #title>Indirizzo</template>
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

      <Accordion :multiple="true" class="w-full lg:w-[50%]">
        <AccordionPanel value="0">
          <AccordionHeader>Caratteristiche Aggiuntive</AccordionHeader>
          <AccordionContent>
            <ul class="items-start ">
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
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="1">
          <AccordionHeader>Descizione</AccordionHeader>
          <AccordionContent>
            <p class="line-height-3">{{ annuncio.descrizione }}</p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
                
        <Card class="mb-4 w-full lg:w-[50%]">
          <template #title>Agente</template>
          <template #content>
            <div class="flex items-center gap-3">
              <Avatar :image="annuncio.agente.urlFotoProfilo" size="large" />
              <div>
                <h3 class="m-0">{{ annuncio.agente.username }}</h3>
                <p class="m-0 text-sm text-500">{{ annuncio.agente.email }}</p>
              </div>
            </div>
          </template>
        </Card>

        <Card v-if="annuncio.contratto.tipoContratto === 'AFFITTO'" class="w-full lg:w-[50%]">
          <template #title>Dettagli Affitto</template>
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

        <Card  class="mb-4 w-full lg:w-[50%]">
        <template #title>Proposte</template>
        <template #content>
          <DataTable stripedRows tableStyle="width: 100%" :value="annuncio.proposte" responsiveLayout="scroll">
            <Column field="prezzoProposta" header="Prezzo Proposta" >
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.prezzoProposta) }}
              </template>
            </Column>
            <Column field="controproposta" header="Controproposta" >
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.controproposta) }}
              </template>
            </Column>
            <Column field="stato" header="Stato">
              <template #body="slotProps">
                <Tag :value="slotProps.data.stato" :severity="getSeverity(slotProps.data)"/>
              </template>
            </Column>
            <Column field="datiProponente.nome" header="Nome Proponente"></Column>
            <Column field="datiProponente.cognome" header="Cognome Proponente"></Column>
            <Column field="datiProponente.contatto.tipo" header="Tipo Contatto"></Column>
            <Column field="datiProponente.contatto.valore" header="Valore Contatto"></Column>
          </DataTable>
        </template>
      </Card>
      </div>
  </div>
</template>
  
  <script setup>
  import { defineProps,ref } from 'vue';
  import { AnnuncioImmobiliareResponse } from '../dto/Response/AnnuncioImmobiliareResponse';
  import Card from 'primevue/card'
  import  Avatar from 'primevue/avatar';
  import Tag from 'primevue/tag';
  import Galleria from 'primevue/galleria';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Accordion from 'primevue/accordion';
  import AccordionPanel from 'primevue/accordionpanel';
  import AccordionHeader from 'primevue/accordionheader';
  import AccordionContent from 'primevue/accordioncontent';


  const props = defineProps({
    annuncio: {
      type: Object,
      required: true,
      default: () => new AnnuncioImmobiliareResponse()
    }
  });

  const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);

const formatCurrency = (value) => {
    if (!value) return '';
    return `€${value.toLocaleString()}`;
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
