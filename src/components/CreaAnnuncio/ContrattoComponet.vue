<script setup>
import { defineProps, defineExpose,reactive,computed } from 'vue';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';

import ToggleSwitch from 'primevue/toggleswitch';
import Message from 'primevue/message';
import { Contratto } from '../../dto/RequestAnnuncio';



const props = defineProps({
  contratto: Contratto,
});

const errori = reactive({
  prezzo: { invalid: false, messaggio: '' },
  caparra: { invalid: false, messaggio: '' },
  tempoMinimo: { invalid: false, messaggio: '' },
  tempoMassimo: { invalid: false, messaggio: '' },
});

const opzioniContratto = [
  { label: 'Affitto', value: 'AFFITTO' },
  { label: 'Vendita', value: 'VENDITA' }
];

const verificaDati = (campo) => {
  if (props.contratto.tipoDiContratto === 'AFFITTO') {
    if (campo === 'prezzo') {
      const prezzo = props.contratto.datiAffittoRequest.prezzo || 0;
      errori.prezzo.invalid = prezzo <= 0;
      errori.prezzo.messaggio = prezzo <= 0 ? 'Il prezzo deve essere maggiore di zero' : '';
    }
    if (campo === 'caparra') {
      const caparra = props.contratto.datiAffittoRequest.caparra || 0;
      errori.caparra.invalid = caparra < 0;
      errori.caparra.messaggio = caparra < 0 ? 'La caparra non può essere negativa' : '';
    }
    
    if (campo === 'tempoMinimo') {
      const tempoMinimo = props.contratto.datiAffittoRequest.tempoMinimo || 0;
      errori.tempoMinimo.invalid = tempoMinimo <= 0;
      errori.tempoMinimo.messaggio = tempoMinimo <= 0 ? 'Il tempo minimo deve essere maggiore di zero' : '';
    }
    if(campo ==='tempoMassimo'){
      const tempoMassimo = props.contratto.datiAffittoRequest.tempoMassimo || 0;
      if(tempoMassimo <= 0){
        errori.tempoMassimo.invalid = true;
        errori.tempoMassimo.messaggio = 'Il tempo massimo deve essere maggiore di zero';
      } else if(tempoMassimo <= props.contratto.datiAffittoRequest.tempoMinimo){
        errori.tempoMassimo.invalid = true;
        errori.tempoMassimo.messaggio = 'Il tempo massimo deve essere maggiore del tempo minimo';
      } else {
        errori.tempoMassimo.invalid = false;
        errori.tempoMassimo.messaggio = '';
      }
    }
  } else if (props.contratto.tipoDiContratto === 'VENDITA') {
    if (campo === 'prezzo') {
      const prezzo = props.contratto.datiVenditaRequest.prezzo || 0;
      errori.prezzo.invalid = prezzo <= 0;
      errori.prezzo.messaggio = prezzo <= 0 ? 'Il prezzo deve essere maggiore di zero' : '';
    }
  }
};

const validaCampi = () => {
  if (props.contratto.tipoDiContratto === 'AFFITTO') {
    ['prezzo', 'caparra', 'tempoMinimo','tempoMassimo'].forEach(campo => verificaDati(campo));
  } else if (props.contratto.tipoDiContratto === 'VENDITA') {
    ['prezzo'].forEach(campo => verificaDati(campo));
    errori.caparra.invalid = false;
    errori.tempoMinimo.invalid = false;
    errori.tempoMassimo.invalid = false;
  }
  return !hasErrori;
};

const hasErrori = computed(() => {
  if(props.contratto.tipoDiContratto === 'VENDITA') {
    return errori.prezzo.invalid;
  }else{
    return Object.values(errori).some(e => e.invalid);
  }
});
defineExpose({
  validaCampi,
  errori,
  hasErrori
});
</script>

<template>
  <div class="p-4 space-y-6 w-full">
    <!-- Sezione per il Tipo di Contratto -->
    <div class="mb-6">
      <label for="tipoContratto" class="block font-semibold mb-2">Tipo di Contratto</label>
      <Select 
        id="tipoContratto" 
        v-model="contratto.tipoDiContratto" 
        :options="opzioniContratto" 
        optionLabel="label"
        optionValue="value"
        placeholder="Seleziona il tipo di contratto"
        class="border rounded p-2 w-full"
      />
    </div>

    <!-- Contenitore dei dati del contratto -->
    <div v-if="contratto.tipoDiContratto" class="border p-4 rounded space-y-4">
      <!-- Sezione per il contratto in AFFITTO -->
      <div v-if="contratto.tipoDiContratto === 'AFFITTO'" class="space-y-4">
        <!-- Prezzo di Affitto e Caparra -->
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Prezzo di Affitto -->
          <div class="flex-1">
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <label for="prezzoAffitto" class="font-semibold md:w-40">Prezzo di Affitto</label>
              <InputText 
                id="prezzoAffitto" 
                v-model="contratto.datiAffittoRequest.prezzo" 
                type="number"
                :invalid="errori.prezzo.invalid" 
                @input="verificaDati('prezzo')" 
                @blur="verificaDati('prezzo')" 
                class="w-full border rounded p-2"
              />
            </div>
            <div class="md:ml-40 mt-1">
              <Message v-if="errori.prezzo.invalid" severity="error" variant="simple" size="small">
                {{ errori.prezzo.messaggio }}
              </Message>
            </div>
          </div>

          <!-- Caparra -->
          <div class="flex-1">
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <label for="caparra" class="font-semibold md:w-40">Caparra</label>
              <InputText 
                id="caparra" 
                v-model="contratto.datiAffittoRequest.caparra" 
                type="number"
                :invalid="errori.caparra.invalid" 
                @input="verificaDati('caparra')" 
                @blur="verificaDati('caparra')" 
                class="w-full border rounded p-2"
              />
            </div>
            <div class="md:ml-40 mt-1">
              <Message v-if="errori.caparra.invalid" severity="error" variant="simple" size="small">
                {{ errori.caparra.messaggio }}
              </Message>
            </div>
          </div>
        </div>

        <!-- Tempo Minimo e Tempo Massimo -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Tempo Minimo -->
          <div>
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <label for="tempoMinimo" class="font-semibold md:w-40">Tempo Minimo</label>
              <InputText 
                id="tempoMinimo" 
                v-model="contratto.datiAffittoRequest.tempoMinimo" 
                type="number"
                :invalid="errori.tempoMinimo.invalid" 
                @input="verificaDati('tempoMinimo')" 
                @blur="verificaDati('tempoMinimo')"
                class="w-full border rounded p-2"
              />
            </div>
            <div class="md:ml-40 mt-1">
              <Message v-if="errori.tempoMinimo.invalid" severity="error" variant="simple" size="small">
                {{ errori.tempoMinimo.messaggio }}
              </Message>
            </div>
          </div>
          <!-- Tempo Massimo -->
          <div>
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <label for="tempoMassimo" class="font-semibold md:w-40">Tempo Massimo</label>
              <InputText 
                id="tempoMassimo"
                v-model="contratto.datiAffittoRequest.tempoMassimo"
                type="number"
                :invalid="errori.tempoMassimo.invalid"
                @input="verificaDati('tempoMassimo')"
                @blur="verificaDati('tempoMassimo')"
                class="w-full border rounded p-2"
              />
            </div>
            <div class="md:ml-40 mt-1">
              <Message v-if="errori.tempoMassimo.invalid" severity="error" variant="simple" size="small">
                {{ errori.tempoMassimo.messaggio }}
              </Message>
            </div>
          </div>
        </div>
      </div>

      <!-- Sezione per il contratto in VENDITA -->
      <div v-if="contratto.tipoDiContratto === 'VENDITA'" class="space-y-4">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Prezzo di Vendita -->
          <div class="flex-1">
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <label for="prezzoVendita" class="font-semibold md:w-40">Prezzo di Vendita</label>
              <InputText 
                id="prezzoVendita" 
                v-model="contratto.datiVenditaRequest.prezzo" 
                type="number"
                :invalid="errori.prezzo.invalid" 
                @input="verificaDati('prezzo')" 
                @blur="verificaDati('prezzo')" 
                class="w-full border rounded p-2"
              />
            </div>
            <div class="md:ml-40 mt-1">
              <Message v-if="errori.prezzo.invalid" severity="error" variant="simple" size="small">
                {{ errori.prezzo.messaggio }}
              </Message>
            </div>
          </div>
          <!-- Mutuo Estinto -->
          <div class="flex-1">
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <label for="mutuoEstinto" class="font-semibold md:w-40">Mutuo Estinto</label>
              <ToggleSwitch v-model="contratto.datiVenditaRequest.mutuoEstinto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
