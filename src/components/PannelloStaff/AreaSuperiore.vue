<template>

  <div class="contenitore-area-superiore items-center flex flex-row">

    <div class="contenitore-foto-profilo flex items-start gap-4">
      <img :src="employeeStore.UrlFotoProfilo" alt="Foto profilo" class="img-profilo" />
      <div class="info-profilo flex flex-col">
        <p>
          <span v-if="isAgente">Agente: &nbsp;</span>
          <span v-else>Manager: &nbsp;</span>
          <b>
            {{ employeeStore.employee.datiImpiegato.nome }}
            {{ employeeStore.employee.datiImpiegato.cognome }}
          </b>
        </p>
        <p>{{ employeeStore.employee.DatiAgenziaImmobiliare.nomeAzienda }}</p>
      </div>
    </div>

    <div class="titolo-pagina">
      <h1>Gestione annunci immobiliari</h1>
    </div>

    <div class="contenitore-btn-nuovo-annuncio">
      <Button v-if="isAgente" @click="toCreaAnnuncio" label="Aggiungi annuncio immobilare" />
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useEmployeeStore } from "../../stores/EmployeeStore";
import { useRouter } from "vue-router";

import Button from "primevue/button";

const router = useRouter();

const employeeStore = useEmployeeStore();

const isAgente = ref(false);

onMounted(() => {
  console.log("EmployeeStore initialized");
  console.log(employeeStore.UrlFotoProfilo);
  if (employeeStore.employee.datiImpiegato.ruolo === "AGENT") {
    isAgente.value = true;
  } else {
    isAgente.value = false;
  }
});

const toCreaAnnuncio = () => {
  router.push({ name: "CreaAnnuncio" });
}

</script>

<style scoped>
.contenitore-area-superiore {
  display: flex;
  flex-direction: row;
  gap: 6rem;
  padding: 1rem;
}

.img-profilo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
</style>
