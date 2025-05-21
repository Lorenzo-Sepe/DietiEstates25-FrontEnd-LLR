<template>
  <div
    class="w-full h-full flex felx-col gap-2 p-2 md:flex-row bg-gray-100"
    v-if="isAnnuncioCompleto(props.annuncio)"
  >
    <div
      class="area-annuncio w-full md:w-[90%] lg:w-[55%] flex flex-col gap-2 mx-auto"
    >
      <div
        class="intestazione-schemi-piccoli w-full flex flex-row gap-2 p-2  lg:hidden"
      >
        <Button
          label="Mostra contatti agenti"
          @click="mostraDialogCardAgente = true"
        />
        <Dialog
          v-model:visible="mostraDialogCardAgente"
          modal
          header="Contatti agente"
          :style="{ width: '100%' }"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        >
          <CardContattiAgente />
        </Dialog>
        <Button label="Fai una proposta" @click="mostraDialogProposte = true" />
        <Dialog
          v-model:visible="mostraDialogProposte"
          maximizable
          modal
          header="PROPOSTE"
          :style="{ width: '90%' }"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        >
          <TabellaProposte :proposte="props.annuncio.proposte" />
        </Dialog>
      </div>

      <div
        v-if="props.annuncio.immobile.immagini"
        class="area-foto w-full p-8 bg-white"
      >
        <Galleria :immagini="props.annuncio.immobile.immagini" />
      </div>

      <div
        class="info-principali w-full flex flex-col p-2 items-start bg-white gap-2"
      >
        <Tag value="Primary">{{ props.annuncio.contratto.tipoContratto }}</Tag>

        <span class="titolo text-2xl md:text-4xl font-bold text-left">{{
          props.annuncio.titolo
        }}</span>

        <span
          class="indirizzo text-sm md:text-lg text-left text-blue-600 font-medium"
          >{{ props.annuncio.immobile.indirizzo.via }},
          {{ props.annuncio.immobile.indirizzo.numeroCivico }} -
          {{ props.annuncio.immobile.indirizzo.citta }} -
          {{ props.annuncio.immobile.indirizzo.cap }}
        </span>

        <span
          v-if="props.annuncio.contratto.tipoContratto == 'AFFITTO'"
          class="indirizzo text-3xl text-left font-bold"
        >
          {{
            formattaPrezzo(
              props.annuncio.contratto.contrattoAffittoResponse.prezzoAffitto,
            )
          }}
          € /mese
        </span>
        <span v-else class="indirizzo text-3xl text-left font-bold">
          {{
            formattaPrezzo(
              props.annuncio.contratto.contrattoVenditaResponse.prezzoVendita,
            )
          }}
          €
        </span>

        <div class="caratteristiche-principali flex flex-row gap-2">
          <span class="mq text-sm text-left md:text-2xl md:font-medium"
            >{{ props.annuncio.immobile.metriQuadri }} m2</span
          >
          <div class="h-8 border-1"></div>
          <span
            class="numero-piani text-sm text-left md:text-2xl md:font-medium"
            >{{ props.annuncio.immobile.numeroDiPiani }} piani</span
          >
          <div class="h-8 border-1"></div>
          <span
            class="numero-bagni text-sm text-left md:text-2xl md:font-medium"
            >{{ props.annuncio.immobile.numeroServizi }} bagni</span
          >
          <div class="h-8 border-1"></div>
          <span
            class="numero-stanze text-sm text-left md:text-2xl md:font-medium"
            >{{ props.annuncio.immobile.numeroStanze }} stanze</span
          >
        </div>
      </div>

      <div
        class="accordions-informazioni-secondarie w-full flex flex-col p-2 items-start bg-white"
      >
        <Accordion value="0" class="accordiations w-full">
          <AccordionPanel value="0" class="descrizione">
            <AccordionHeader>DESCRIZIONE</AccordionHeader>
            <AccordionContent>
              <span class="text-left text-xl">
                {{ props.annuncio.descrizione }}
              </span>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="1" class="caratteristiche mt-2">
            <AccordionHeader>CARATTERSTICHE AGGIUTIVE</AccordionHeader>
            <AccordionContent>
              <div class="flex flex-col gap-2">
                <span
                  v-if="
                    props.annuncio.immobile.caratteristicheAggiuntive.ascensore
                  "
                  >Nel palazzo è presente l'ascensore</span
                >
                <span
                  v-if="
                    props.annuncio.immobile.caratteristicheAggiuntive.balconi
                  "
                  >Sono presenti uno o più balconi</span
                >
                <span
                  v-if="
                    props.annuncio.immobile.caratteristicheAggiuntive.cantina
                  "
                  >L'immobile dispone di una cantina</span
                >
                <span
                  v-if="
                    props.annuncio.immobile.caratteristicheAggiuntive.soffitta
                  "
                  >L'immobile dispone di una soffitta</span
                >
                <span
                  v-if="
                    props.annuncio.immobile.caratteristicheAggiuntive
                      .climatizzatori
                  "
                  >Sono presenti uno o più condizionatori</span
                >
                <span
                  v-if="
                    props.annuncio.immobile.caratteristicheAggiuntive.garage
                  "
                  >È compreso il garage</span
                >
                <span
                  v-if="
                    props.annuncio.immobile.caratteristicheAggiuntive.postiAuto
                  "
                  >È compreso il posto auto</span
                >
                <span
                  v-if="
                    props.annuncio.immobile.caratteristicheAggiuntive.giardino
                  "
                  >L'immobile dispone di un giardino</span
                >
                <span
                  v-if="
                    props.annuncio.immobile.caratteristicheAggiuntive
                      .pannelliSolari
                  "
                  >Impianto fotovoltaico installato per la produzione di energia
                  elettrica autonoma</span
                >
                <span
                  v-if="
                    props.annuncio.immobile.caratteristicheAggiuntive.portiere
                  "
                  >Servizio di portineria presente</span
                >
                <span
                  v-if="
                    props.annuncio.immobile.caratteristicheAggiuntive
                      .riscaldamentoCentralizzato
                  "
                  >L’immobile dispone di riscaldamento centralizzato.</span
                >
                <span
                  v-if="
                    props.annuncio.immobile.caratteristicheAggiuntive
                      .descrizioneAggiuntiva
                  "
                  >{{
                    props.annuncio.immobile.caratteristicheAggiuntive
                      .descrizioneAggiuntiva
                  }}</span
                >
              </div>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="2" class="contratto mt-2">
            <AccordionHeader>CONDIZIONI CONTRATTUALI</AccordionHeader>
            <AccordionContent>
              <div
                v-if="props.annuncio.contratto.tipoContratto === 'AFFITTO'"
                class="informazioni-affitto w-full flex flex-col gap-2"
              >
                <span class="text-lg">
                  Tempo minimo di affitto:
                  <span class="font-medium"
                    >{{
                      props.annuncio.contratto.contrattoAffittoResponse
                        .tempoMinimo
                    }}
                    mesi</span
                  >
                </span>
                <span class="text-lg">
                  Tempo massimo di affitto:
                  <span class="font-medium"
                    >{{
                      props.annuncio.contratto.contrattoAffittoResponse
                        .tempoMassimo
                    }}
                    mesi</span
                  >
                </span>

                <span class="mt-4 text-lg">
                  Prezzo affitto:
                  <span class="font-medium"
                    >{{
                      formattaPrezzo(
                        props.annuncio.contratto.contrattoAffittoResponse
                          .prezzoAffitto,
                      )
                    }}
                    €</span
                  >
                </span>
                <span class="text-lg">
                  Cauzione:
                  <span class="font-medium"
                    >{{
                      formattaPrezzo(
                        props.annuncio.contratto.contrattoAffittoResponse
                          .caparra,
                      )
                    }}
                    €</span
                  >
                </span>
              </div>
              <div
                v-else
                class="informazioni-vendita w-full flex flex-col gap-2"
              >
                <span class="mt-4 text-lg">
                  Prezzo Vendita:
                  <span class="font-medium"
                    >{{
                      formattaPrezzo(
                        props.annuncio.contratto.contrattoVenditaResponse
                          .prezzoVendita,
                      )
                    }}
                    €</span
                  >
                </span>
                <span class="mt-4 text-lg">
                  Mutuo estinto:
                  <span
                    class="font-medium"
                    v-if="
                      props.annuncio.contratto.contrattoVenditaResponse
                        .mutuoEstinto
                    "
                  >
                    Si
                  </span>
                  <span class="font-medium" v-else> No</span>
                </span>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </div>

    <div class="flex flex-col gap-2 w-[45%] hidden lg:block">
      <div
        class="area-contatti-agente w-full flex flex-col gap-2 p-2 items-center justify-center"
      >
        <CardContattiAgente />
      </div>

      <div class="area-proposte w-full flex flex-col gap-2 p-2 mx-auto">
        <TabellaProposte
          :proposte="props.annuncio.proposte"
          :contratto="props.annuncio.contratto"
          :propostaRequest="props.propostaRequest"
          @inviaNuovaProposta="inviaNuovaProposta"
        />
      </div>
    </div>
  </div>

  <div v-else class="w-full h-screen">
    <ScheletroPagina />
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from "vue";
import { useRoute } from "vue-router";

import Galleria from "../../components/DettaglioAnnuncio/Galleria.vue";
import CardContattiAgente from "../../components/DettaglioAnnuncio/CardContattiAgente.vue";
import ScheletroPagina from "../../components/DettaglioAnnuncio/ScheletroPagina.vue";
import TabellaProposte from "../../components/DettaglioAnnuncio/TabellaProposte.vue";

import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import Tag from "primevue/tag";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

const route = useRoute();

const props = defineProps(["annuncio", "propostaRequest"]);
const emit = defineEmits(["inviaNuovaProposta"]);

const mostraDialogCardAgente = ref(false);
const mostraDialogProposte = ref(false);

const isAnnuncioCompleto = (annuncio) => {
  return (
    annuncio &&
    annuncio.immobile &&
    annuncio.immobile.indirizzo &&
    annuncio.immobile.immagini &&
    annuncio.contratto &&
    (annuncio.contratto.contrattoAffittoResponse ||
      annuncio.contratto.contrattoVenditaResponse) &&
    annuncio.immobile.caratteristicheAggiuntive
  );
};

onMounted(() => {
  console.log("figlio annuncio:", props.annuncio);
});

function formattaPrezzo(prezzoStringa) {
  // Converte in numero e formatta con separatore delle migliaia
  return Number(prezzoStringa).toLocaleString("it-IT");
}

const inviaNuovaProposta = () => {
  emit("inviaNuovaProposta");
};
</script>
