<template>
  <!-------------  SEZIONE DIALOG PER GLI ALLERT ------------------------------------------------>

  <Dialog v-model:visible="loadingOperazione" :closable="false" header="OPERAZIONE IN CORSO" :style="{ width: 'auto' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div class="card flex justify-center">
      <ProgressSpinner />
    </div>
  </Dialog>

  <Dialog v-model:visible="okAllert" @close="okAllert = false" header="CONFERMA OPERAZIONE" :style="{ width: 'auto' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <p class="m-0">Operazione conclusa con successo</p>
    <Button severity="contrast" label="OK" @click="okAllert = false" />
  </Dialog>

  <Dialog v-model:visible="erroreAllert" header="ERRORE" @close="erroreAllert = false" :style="{ width: 'auto' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <p class="m-0">Errore di rete, riprovare più tardi.</p>
    <Button label="OK" @click="erroreAllert = false" severity="contrast" />
  </Dialog>

  <Dialog v-model:visible="registrationVisible" @close="registrationVisible = false" header="REGISTRA NUOVO DIPENDENTE"
    :style="{ width: 'auto' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <RegisterAgentDialog @close="closeFormNuovoDipendente" />
  </Dialog>

  <!-------------------------------------------- ------------------------------------------------>

  <div class="w-full flex flex-col gap-2 px-4">
    <AreaSuperiore class="w-full items-center justify-center" @aggiungiDipendente="registrationVisible = true" />

    <ScheletroListaAgenti v-if="loadingListaAgenti" class="w-full" />

    <div v-else class="w-full">

      <div class="w-full" v-if="!isAgente">
        <h2>Lista agenti dell'agenzia:</h2>
        <Accordion v-model:activeIndex="activeIndex" @update:activeIndex="onAccordionToggle" expandIcon="pi pi-plus"
          collapseIcon="pi pi-minus">
          <AccordionPanel class="my-2" v-for="(agente, index) in agenti" :value="index">
            <AccordionHeader class="!bg-surface-100 hover:bg-surface-300!">
              <span class="flex items-center gap-2 w-full">
                <div class="w-10 h-10 rounded-full overflow-hidden">
                  <img :src="agente.infoUtente.urlFotoProfilo" :alt="agente.infoUtente.nomeVisualizzato"
                    class="w-full h-full object-cover" />
                </div>
                <span class="font-bold whitespace-nowrap">{{
                  agente.infoUtente.nomeVisualizzato
                }}</span>
              </span>
            </AccordionHeader>
            <AccordionContent>
              <TabellaAnnunci class="w-full mb-2" :propAnnunci="annunci" :propLoading="loading"
                :propNumeroAnnunci="totaleAnnunci" :propostaRequest="propostaRequest" :isAgente="isAgente"
                :agente="employeeStore.dipendenti" @nuovaProposta="aggiungiPropostaManuale"
                @eliminaAnnuncio="eliminaAnnuncio" @eliminaProposta="rifiutaProposta" @accettaProposta="accettaProposta"
                @controproposta="controproposta" @onPage="getAnnunciByPagina" />
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>

      <div v-else>
        <TabellaAnnunci class="w-full mb-2" :propAnnunci="annunci" :propLoading="loading"
          :propNumeroAnnunci="totaleAnnunci" :propostaRequest="propostaRequest" :isAgente="isAgente"
          :agente="employeeStore.dipendenti" @nuovaProposta="aggiungiPropostaManuale" @eliminaProposta="rifiutaProposta"
          @accettaProposta="accettaProposta" @controproposta="controproposta" @onPage="getAnnunciByPagina"
          @eliminaAnnuncio="eliminaAnnuncio" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

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

const activeIndex = ref(0);
const annunci = ref([]);
const totaleAnnunci = ref(0);
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
 
  buildStaffView();
});

const buildStaffView = async () => {

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

      onAccordionToggle(0);

      loadingListaAgenti.value = false;
    }
  }
};

const filterAgenti = (dipendenti) => {
  return dipendenti
    ? dipendenti.filter(
      (dipendente) => dipendente.infoUtente.tipoAccount === "AGENT",
    )
    : [];
};

const onAccordionToggle = async (newIndex) => {

  if (newIndex !== null) {

    loading.value = true;

    filtroAnnunci.agenteCreatoreAnnuncio =
      agenti.value[newIndex].infoUtente.email;

    await getNumeroAnnunci();

    await getAnnunci();

    loading.value = false;

  }

};

const getNumeroAnnunci = async () => {

  totaleAnnunci.value = await AnnunciService.getNumeroAnnunciByStaff(filtroAnnunci);

}

const getAnnunciByPagina = async (pagina) => {

  loading.value = true;

  filtroAnnunci.numeroPagina = pagina;

  try {

    await getAnnunci();

  } catch (error) {

    console.log("errore durante la chiamata axsios per la get annunci by pagina: ", error);
    annunci.value = [];

  }

  loading.value = false;

}

const getAnnunci = async () => {

  try {

    annunci.value = [{}];
    annunci.value = await AnnunciService.getAnnunciByStaff(filtroAnnunci);
    console.log("annunci.value: ", annunci.value);

  } catch (error) {

    console.log(
      "errore durante la chiamata axsios per la get annunci: ",
      error,
    );

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

const eliminaAnnuncio = async (idAnnuncio) => {

  try {

    loadingOperazione.value = true;

    await AnnunciService.eliminaAnnuncio(idAnnuncio);

    loadingOperazione.value = false;

    okAllert.value = true;

  } catch (error) {

    loadingOperazione.value = false;

    erroreAllert.value = true;

    return;
  }

  try {

    loading.value = true;

    filtroAnnunci.numeroPagina = 1;

    totaleAnnunci.value = await AnnunciService.getNumeroAnnunciByStaff(filtroAnnunci);

    await getAnnunci();

  } catch (error) {

    console.log("errore durante l'aggiornamento della lista annunci dopo l'eliminazione: ", error);

  }

  loading.value = false;

};

const closeFormNuovoDipendente = async() => {

  loadingListaAgenti.value = true;

  registrationVisible.value = false;

  await buildStaffView();

  loadingListaAgenti.value = false;

}

</script>
