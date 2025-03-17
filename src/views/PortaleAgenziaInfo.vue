<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div class="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 class="text-2xl font-bold">Benvenuto nel nostro Portale Immobiliare</h1>
        <p class="mt-4 text-gray-600">
          Benvenuto sul nostro portale, dedicato alle agenzie immobiliari e ai loro agenti. Qui puoi pubblicare i tuoi annunci e raggiungere un sacco di potenziali acquirenti. Gli utenti possono sfogliare gli annunci e inviare una proposta che, oltre all'offerta economica, include i loro contatti per essere ricontattati. In questo modo, comprare o vendere diventa davvero semplice e veloce.
        </p>
        <SchedaAutenticazione />
      </div>
    </div>
  </template>
  
  <script>
  import SchedaAutenticazione from "./SchedaAutenticazione.vue";
  
  export default {
    components: {
      SchedaAutenticazione,
    },
  };
  </script>
  