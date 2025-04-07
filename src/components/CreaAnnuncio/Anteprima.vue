<script setup>
import { defineProps, defineEmits ,computed} from 'vue';
import Button from 'primevue/button';
import { AnnuncioImmobiliareRequest } from '../../dto/RequestAnnuncio';
import DettagliAnnuncio from '../DettagliAnnuncio.vue';
import { AnnuncioImmobiliareResponse,Agente,CaratteristicheAggiuntive,Contatto,Contratto,ContrattoAffittoResponse,ContrattoVenditaResponse,DatiProponente,Immagine,Immobile,Indirizzo,Proposta } from '../../dto/Response/AnnuncioImmobiliareResponse';
import StickyButtons from './StickyButtons.vue';
const emit = defineEmits(['indietro', 'invia']);

const props = defineProps({ 
  annuncio: AnnuncioImmobiliareRequest,
  tentativoInvio: Boolean
});


function mappaAnnuncio(input) {
    const request = new AnnuncioImmobiliareRequest(input);
    return new AnnuncioImmobiliareResponse({
        id: 0, // L'ID sarà probabilmente generato dal database
        titolo: request.titolo,
        descrizione: request.descrizione,
        agente: new Agente({}), // Non è presente in AnnuncioImmobiliareRequest, potrebbe essere aggiunto separatamente
        immobile: new Immobile({
            tipologiaImmobile: request.immobile.tipologiaImmobile,
            metriQuadri: request.immobile.metriQuadri,
            classeEnergetica: request.immobile.classeEnergetica,
            numeroServizi: request.immobile.numeroServizi,
            numeroStanze: request.immobile.numeroStanze,
            numeroDiPiani: request.immobile.numeroDiPiani,
            indirizzo: new Indirizzo({
                ...request.immobile.indirizzo,
                vicinoA: [] // Non presente nella request
            }),
            caratteristicheAggiuntive: new CaratteristicheAggiuntive(request.immobile.caratteristicheAggiuntive),
            immagini: request.immobile.immagini.map(img => new Immagine({
                url: img.urlImmagineEsistente,
                descrizione: img.descrizione
            }))
        }),
        contratto: new Contratto({
            tipoContratto: request.contratto.tipoDiContratto,
            contrattoVenditaResponse: new ContrattoVenditaResponse({
                prezzoVendita: request.contratto.datiVenditaRequest.prezzo,
                mutuoEstinto: request.contratto.datiVenditaRequest.mutuoEstinto
            }),
            contrattoAffittoResponse: new ContrattoAffittoResponse({
                prezzoAffitto: request.contratto.datiAffittoRequest.prezzo,
                tempoMinimo: request.contratto.datiAffittoRequest.tempoMinimo,
                tempoMassimo: request.contratto.datiAffittoRequest.tempoMassimo,
                caparra: request.contratto.datiAffittoRequest.caparra
            })
        }),
        proposte: [] // Non esistono proposte in AnnuncioImmobiliareRequest, quindi inizialmente vuoto
    });
}
const response = computed(() => mappaAnnuncio(props.annuncio));




</script>

<template>
  <div>
    <DettagliAnnuncio 
      v-model:annuncio="response"
    />
    <StickyButtons>
        <div class="flex pt-6 justify-between">
          <Button label="Indietro" severity="secondary" icon="pi pi-arrow-left" @click="$emit('indietro')" />
          <Button label="Invia Annuncio" icon="pi pi-check" @click="$emit('invia')" class="p-mt-2" />
        </div>
    </StickyButtons>
  </div>
</template>

