<template>
  <!-------------  SEZIONE DIALOG PER GLI ALLERT ------------------------------------------------>
  <Dialog
    v-model:visible="loadingOperazione"
    @close="loadingOperazione = false"
    header="OPERAZIONE IN CORSO"
    :style="{ width: 'auto' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <div class="card flex justify-center">
      <ProgressSpinner />
    </div>
  </Dialog>

  <Dialog
    v-model:visible="okAllert"
    @close="okAllert = false"
    header="CONFERMA OPERAZIONE"
    :style="{ width: 'auto' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <p class="m-0">Operazione conclusa con successo</p>
    <Button severity="contrast" label="OK" @click="okAllert = false" />
  </Dialog>

  <Dialog
    v-model:visible="erroreAllert"
    header="ERRORE"
    @close="erroreAllert = false"
    :style="{ width: 'auto' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <p class="m-0">Errore di rete, riprovare più tardi.</p>
    <Button label="OK" @click="erroreAllert = false" severity="contrast" />
  </Dialog>

  <Dialog
    v-model:visible="registrationVisible"
    @close="registrationVisible = false"
    header="REGISTRA NUOVO DIPENDENTE"
    :style="{ width: 'auto' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <RegisterAgentDialog @close="registrationVisible = false" />
  </Dialog>

  <!-------------------------------------------- ------------------------------------------------>

  <div class="w-full flex flex-col gap-2 px-4">
    <AreaSuperiore class="w-full items-center justify-center" />

    <ScheletroListaAgenti v-if="loadingListaAgenti" class="w-full" />

    <div v-else class="w-full">
      <h2 v-if="!isAgente">Lista agenti dell'agenzia:</h2>
      <Accordion
        v-model:activeIndex="activeIndex"
        :multiple="false"
        @update:activeIndex="onAccordionToggle"
        expandIcon="pi pi-plus"
        collapseIcon="pi pi-minus"
      >
        <AccordionPanel
          class="my-2"
          v-for="(agente, index) in agenti"
          :value="index"
        >
          <AccordionHeader class="!bg-surface-100 hover:bg-surface-300!">
            <span class="flex items-center gap-2 w-full">
              <div class="w-10 h-10 rounded-full overflow-hidden">
                <img
                  :src="agente.infoUtente.urlFotoProfilo"
                  :alt="agente.infoUtente.nomeVisualizzato"
                  class="w-full h-full object-cover"
                />
              </div>
              <span class="font-bold whitespace-nowrap">{{
                agente.infoUtente.nomeVisualizzato
              }}</span>
            </span>
          </AccordionHeader>
          <AccordionContent>
            <TabellaAnnunci
              class="w-full mb-2"
              :propAnnunci="annunci"
              :propLoading="loading"
              :propostaRequest="propostaRequest"
              :isAgente="isAgente"
              :agente="employeeStore.dipendenti"
              @nuovaProposta="aggiungiPropostaManuale"
              @eliminaProposta="rifiutaProposta"
              @accettaProposta="accettaProposta"
              @controproposta="controproposta"
            />
            <Button
              severity="contrast"
              icon="pi pi-plus"
              @click="toCreaAnnuncio"
              label="Crea un Annuncio"
              raised
            ></Button>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>

      <div
        v-if="!isAgente"
        class="buttonArea flex flex-row gap-2 justify-center items-center"
      >
        <Button
          severity="contrast"
          class="mb-2"
          label="Aggiungi Agente"
          @click="registrationVisible = true"
          raised
        />
        <Button
          severity="contrast"
          class="mb-2"
          label="Crea Notifica Promozionale"
          @click="newNotification"
          raised
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";

import AreaSuperiore from "../components/PannelloStaff/AreaSuperiore.vue";
import ScheletroListaAgenti from "../components/PannelloStaff/ScheletroListaAgenti.vue";
import TabellaAnnunci from "../components/PannelloStaff/tabellaAnnunci.vue";
import RegisterAgentDialog from "../components/Dialogs/RegisterAgentDialog.vue";
import AnnunciService from "../services/TabellaAnnunciService";
import PropostaService from "../services/PropostaService";
import { FiltroAnnuncioRequest } from "../dto/FiltroAnnunciRequest";
import { PropostaRequest } from "../dto/PropostaRequest";
import { useEmployeeStore } from "../stores/EmployeeStore";

const router = useRouter();

const activeIndex = ref(null);
const numeroAnnunci = ref(0);
const annunci = ref([]);
const loading = ref(true);
const loadingListaAgenti = ref(true);
const employeeStore = useEmployeeStore();

const okAllert = ref(false);
const erroreAllert = ref(false);
const registrationVisible = ref(false);
const loadingOperazione = ref(false);
const agenti = ref([]);
const isAgente = ref(false);
const isAnnunciEmpty = ref(false);

const filtroAnnunci = reactive(new FiltroAnnuncioRequest());
const propostaRequest = reactive(new PropostaRequest());

onMounted(async () => {
  try {
    await employeeStore.aggiorna();
  } catch (error) {
    console.log("errore durante l'aggiormamento dati pinia: ", error);
    return;
  } finally {
    if (employeeStore.ruolo === "MANAGER") {
      agenti.value = filterAgenti(
        Array.from(
          employeeStore.employee.DatiAgenziaImmobiliare.dipendentiDettagli.values(),
        ),
      );
      loadingListaAgenti.value = false;
      if (agenti.value.length === 0) {
        isAnnunciEmpty.value = true;
      }
    } else {
      const dettagliAgente = ref({
        infoUtente: {
          nomeVisualizzato: employeeStore.infoUtente.nomeVisualizzato,
          email: employeeStore.infoUtente.email,
          telefono: employeeStore.infoUtente.telefono,
          tipoAccount: employeeStore.infoUtente.tipoAccount,
          urlFotoProfilo: employeeStore.infoUtente.urlFotoProfilo,
        },
      });
      agenti.value.push(dettagliAgente.value);
      isAgente.value = true;
      loadingListaAgenti.value = false;
    }
  }
});

const filterAgenti = (dipendenti) => {
  return dipendenti
    ? dipendenti.filter(
        (dipendente) => dipendente.infoUtente.tipoAccount === "AGENT",
      )
    : [];
};

const onAccordionToggle = (newIndex) => {
  if (newIndex !== null) {
    console.log("Dati utente:", agenti.value[newIndex].infoUtente.email);
    filtroAnnunci.agenteCreatoreAnnuncio =
      agenti.value[newIndex].infoUtente.email;
    getAnnunci();
  }
};

const toCreaAnnuncio = () => {
  router.push({ name: "CreaAnnuncio" });
};

const getNumeroAnnunci = async () => {
  try {
    numeroAnnunci.value = await AnnunciService.getNumeroAnnunciByStaff();
    console.log("numero annunci:", numeroAnnunci.value);
  } catch (error) {
    console.log(
      "errore durante la chiamata axsios per la get numero annunci: ",
      error,
    );
  }
};

const getAnnunci = async () => {
  try {
    annunci.value = [{}];
    loading.value = true;
    annunci.value = await AnnunciService.getAnnunciByStaff(filtroAnnunci);
  } catch (error) {
    console.log(
      "errore durante la chiamata axsios per la get annunci: ",
      error,
    );
  } finally {
    loading.value = false;
    console.log("annunci:", annunci.value);
  }
};

const aggiungiPropostaManuale = async () => {
  try {
    loadingOperazione.value = true;
    const nuovaProposta =
      await AnnunciService.postPropostaManuale(propostaRequest);
    loadingOperazione.value = false;
    aggiungiProposta(nuovaProposta.idProposta);
    okAllert.value = true;
  } catch (error) {
    console.log(
      "errore durante la chiamata axsios per la aggiunta proposta manuale: ",
      error,
    );
    loadingOperazione.value = false;
    erroreAllert.value = true;
  }
};

const rifiutaProposta = async (idProposta) => {
  try {
    loadingOperazione.value = true;
    await PropostaService.rifiutaProposta(idProposta);
    loadingOperazione.value = false;
    changeStatoProposta(idProposta, "RIFIUTATO");
    okAllert.value = true;
  } catch (error) {
    console.log(
      "errore durante la chiamata axsios per la eliminazione proposta: ",
      error,
    );
    loadingOperazione.value = false;
    erroreAllert.value = true;
  }
};

const changeStatoProposta = (idProposta, stato) => {
  if (stato === "RIFIUTATO") {
    annunci.value.forEach((annuncio) => {
      annuncio.proposte.forEach((proposta) => {
        if (proposta.idProposta === idProposta) {
          proposta.stato = "RIFIUTATO";

          return;
        }
      });
    });
  } else if (stato === "ACCETTATO") {
    annunci.value.forEach((annuncio) => {
      annuncio.proposte.forEach((proposta) => {
        if (proposta.idProposta === idProposta) {
          proposta.stato = "ACCETTATO";

          return;
        }
      });
    });
  }
};

const aggiungiProposta = (idProposta) => {
  annunci.value.forEach((annuncio) => {
    if (annuncio.id === propostaRequest.annuncioId) {
      annuncio.proposte.push({
        idProposta: idProposta,
        prezzoProposta: propostaRequest.prezzo,
        stato: "IN_TRATTAZIONE",
        controproposta: null,
        datiProponente: {
          nome: propostaRequest.nome,
          cognome: propostaRequest.cognome,
          tipoContatto: propostaRequest.tipoContatto,
          contatto: propostaRequest.informazioniContatto,
        },
      });

      return;
    }
  });
};

const accettaProposta = async (idProposta) => {
  try {
    loadingOperazione.value = true;
    await PropostaService.accettaProposta(idProposta);
    loadingOperazione.value = false;
    changeStatoProposta(idProposta, "ACCETTATO");
    okAllert.value = true;
  } catch (error) {
    console.log(
      "errore durante la chiamata axsios per la accettazione proposta: ",
      error,
    );
    loadingOperazione.value = false;
    erroreAllert.value = true;
  }
};

const controproposta = async (idProposta, prezzoControproposta) => {
  try {
    loadingOperazione.value = true;
    await PropostaService.controproposta(idProposta, prezzoControproposta);
    loadingOperazione.value = false;
    changeControposta(idProposta, prezzoControproposta);
    okAllert.value = true;
  } catch (error) {
    console.log(
      "errore durante la chiamata axsios per la controproposta proposta: ",
      error,
    );
    loadingOperazione.value = false;
    erroreAllert.value = true;
  }
};

const changeControposta = (idProposta, prezzoControproposta) => {
  annunci.value.forEach((annuncio) => {
    annuncio.proposte.forEach((proposta) => {
      if (proposta.idProposta === idProposta) {
        proposta.controproposta = prezzoControproposta;

        return;
      }
    });
  });
};

function newNotification() {
  router.push({ name: "NuovaPromozione" });
}
</script>
