<template>
  <div
    class="flex flex-col lg:flex-row lg:items-start justify-beween items-center lg:gap-5 mb-5 px-5"
  >
    <div class="lg:max-w-[28%]">
      <h1>Benvenuto nel nostro Portale Immobiliare</h1>
      <p>
        Benvenuto sul nostro portale, dedicato alle agenzie immobiliari e ai
        loro agenti. Qui puoi pubblicare i tuoi annunci e raggiungere un sacco
        di potenziali acquirenti. Gli utenti possono sfogliare gli annunci e
        inviare una proposta che, oltre all'offerta economica, include i loro
        contatti per essere ricontattati.
      </p>
    </div>

    <Accordion value="1" class="mt-5 w-full lg:max-w-[70%]">
      <AccordionPanel value="1" fluid>
        <AccordionHeader>Registra la tua agenzia ora</AccordionHeader>
        <AccordionContent>
          <AgencyRegistration />
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="2" fluid>
        <AccordionHeader>Accedi con le credenziali aziendali</AccordionHeader>
        <AccordionContent>
          <Login />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup>
import Login from "../components/Logins/Login.vue";

import Fluid from "primevue/fluid";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import AgencyRegistration from "../components/Logins/AgencyRegistration.vue";
</script>
