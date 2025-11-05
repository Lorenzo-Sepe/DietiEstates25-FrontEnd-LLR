<template>

  <div class="hidden lg:flex flex-row gap-24 p-4 m-2 bg-[whitesmoke] items-center justify-center">

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
      <h1 v-if="isAgente">Gestione dei tuoi annunci immobiliari</h1>
      <h1 v-else>Gestione annunci immobiliari di tutti gli agenti</h1>
    </div>

    <div class="contenitore-btn-nuovo-annuncio">
      <Button v-if="isAgente" @click="toCreaAnnuncio" label="Aggiungi annuncio immobilare" />
      <Button v-else @click="$emit('aggiungiDipendente')" label="Aggiungi dipendente" />
    </div>

  </div>


  <div class="flex lg:hidden flex-col gap-4 p-4 m-2 bg-[whitesmoke] items-center justify-center">

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
      <h1 v-if="isAgente">Gestione dei tuoi annunci immobiliari</h1>
      <h1 v-else>Gestione annunci immobiliari di tutti gli agenti</h1>
    </div>

    <div class="contenitore-btn-nuovo-annuncio">
      <Button v-if="isAgente" @click="toCreaAnnuncio" label="Aggiungi annuncio immobilare" />
      <Button v-else @click="$emit('aggiungiDipendente')" label="Aggiungi dipendente" />
    </div>

  </div>

</template>

<script setup>
import { onMounted, ref, defineEmits } from "vue";
import { useEmployeeStore } from "../../stores/EmployeeStore";
import { useRouter } from "vue-router";

import Button from "primevue/button";

const router = useRouter();

const employeeStore = useEmployeeStore();

const isAgente = ref(false);

const emits = defineEmits(["aggiungiDipendente"]);

onMounted(() => {

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
  margin: 0.5rem;
  background-color: whitesmoke;

}

.img-profilo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
</style>
