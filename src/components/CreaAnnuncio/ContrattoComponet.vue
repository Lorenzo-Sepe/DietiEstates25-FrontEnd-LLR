<script setup>
import { defineProps, defineExpose, reactive, computed, watch, ref } from 'vue';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';

import ToggleSwitch from 'primevue/toggleswitch';
import Message from 'primevue/message';
import { Contratto } from '../../dto/RequestAnnuncio';
import { scrollToFirstError } from '../../utils/scrollToError';


const props = defineProps({
  contratto: Contratto,
});
const isFirstValidation = ref(true);

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
    if (campo === 'tempoMassimo') {
      const tempoMassimo = props.contratto.datiAffittoRequest.tempoMassimo || 0;
      if (tempoMassimo <= 0) {
        errori.tempoMassimo.invalid = true;
        errori.tempoMassimo.messaggio = 'Il tempo massimo deve essere maggiore di zero';
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
  isFirstValidation.value = false;
  if (props.contratto.tipoDiContratto === 'AFFITTO') {
    ['prezzo', 'caparra', 'tempoMinimo', 'tempoMassimo'].forEach(campo => verificaDati(campo));
  } else if (props.contratto.tipoDiContratto === 'VENDITA') {
    ['prezzo'].forEach(campo => verificaDati(campo));
    errori.caparra.invalid = false;
    errori.tempoMinimo.invalid = false;
    errori.tempoMassimo.invalid = false;
  }
  return !hasErrori;
};

const hasErrori = computed(() => {
  if (props.contratto.tipoDiContratto === 'VENDITA') {
    return errori.prezzo.invalid;
  } else {
    return Object.values(errori).some(e => e.invalid);
  }
});
const scroll = () => {
  scrollToFirstError(errori);
};
defineExpose({
  validaCampi,
  errori,
  hasErrori,
  scroll
});

watch(() => props.contratto.tipoDiContratto, () => {
  if (!isFirstValidation.value) {
    validaCampi();
  }
});

</script>

<template>
  <div class="border border-black p-4 space-y-6 my-4">
    <!-- Sezione per il Tipo di Contratto -->
    <div class="mb-6">
      <label for="tipoContratto" class="block font-semibold mb-2">Tipo di Contratto</label>
      <Select id="tipoContratto" v-model="contratto.tipoDiContratto" :options="opzioniContratto" optionLabel="label"
        optionValue="value" placeholder="Seleziona il tipo di contratto" class="!border !rounded !p-2 !w-full" />
    </div>

    <!-- Contenitore dei dati del contratto -->
    <div v-if="contratto.tipoDiContratto" class="border-1 border-black p-4 rounded">

      <!-- Sezione per il contratto in AFFITTO -->
      <div v-if="contratto.tipoDiContratto === 'AFFITTO'" class="flex flex-col md:flex-row gap-4 justify-center items-centerr">
        <!-- Prezzo di Affitto e Caparra -->
        <div class="flex flex-col gap-2">
          <!-- Prezzo di Affitto -->
          <div class="flex flex-col">
            <label for="prezzoAffitto" class="font-semibold">Prezzo di Affitto</label>
            <InputText id="prezzoAffitto" v-model="contratto.datiAffittoRequest.prezzo" type="number"
              :invalid="errori.prezzo.invalid" @input="verificaDati('prezzo')" @blur="verificaDati('prezzo')"
              class="w-full" />
            <div class="min-h-[24px]">
              <Message v-if="errori.prezzo.invalid" severity="error" variant="simple" size="small">
                {{ errori.prezzo.messaggio }}
              </Message>
            </div>
          </div>

          <!-- Caparra -->
          <div class="flex flex-col">
            <label for="caparra" class="font-semibold">Caparra</label>
            <InputText id="caparra" v-model="contratto.datiAffittoRequest.caparra" type="number"
              :invalid="errori.caparra.invalid" @input="verificaDati('caparra')" @blur="verificaDati('caparra')"
              class="w-full" />
            <div class="min-h-[24px]">
              <Message v-if="errori.caparra.invalid" severity="error" variant="simple" size="small">
                {{ errori.caparra.messaggio }}
              </Message>
            </div>
          </div>
        </div>

        <!-- Tempo Minimo e Tempo Massimo -->
        <div class="flex flex-col gap-2">
          <!-- Tempo Minimo -->

          <div class="flex flex-col">
            <label for="tempoMinimo" class="font-semibold">Tempo Minimo</label>
            <InputText id="tempoMinimo" v-model="contratto.datiAffittoRequest.tempoMinimo" type="number"
              :invalid="errori.tempoMinimo.invalid" @input="verificaDati('tempoMinimo')"
              @blur="verificaDati('tempoMinimo')" class="w-full" />
            <div class="min-h-[24px]">
              <Message v-if="errori.tempoMinimo.invalid" severity="error" variant="simple" size="small">
                {{ errori.tempoMinimo.messaggio }}
              </Message>
            </div>
          </div>

          <!-- Tempo Massimo -->
          <div class="flex flex-col">
            <label for="tempoMassimo" class="font-semibold">Tempo massimo</label>
            <InputText id="tempoMassimo" v-model="contratto.datiAffittoRequest.tempoMassimo" type="number"
              :invalid="errori.tempoMassimo.invalid" @input="verificaDati('tempoMassimo')"
              @blur="verificaDati('tempoMassimo')" class="w-full" />
            <div class="min-h-[24px]">
              <Message v-if="errori.tempoMassimo.invalid" severity="error" variant="simple" size="small">
                {{ errori.tempoMassimo.messaggio }}
              </Message>
            </div>
          </div>

        </div>

      </div>

      <!-- Sezione per il contratto in VENDITA -->
      <div v-if="contratto.tipoDiContratto === 'VENDITA'" class="flex flex-col gap-4">

        <!-- Prezzo di Vendita -->
        <div class="flex flex-col">
          <label for="prezzoVendita" class="font-semibold">Prezzo di Vendita</label>
          <InputText id="prezzoVendita" v-model="contratto.datiVenditaRequest.prezzo" type="number"
            :invalid="errori.prezzo.invalid" @input="verificaDati('prezzo')" @blur="verificaDati('prezzo')"
            class="border rounded p-2" />
          <div class="">
            <Message v-if="errori.prezzo.invalid" severity="error" variant="simple" size="small">
              {{ errori.prezzo.messaggio }}
            </Message>
          </div>
        </div>


        <!-- Mutuo Estinto -->
        <div class="flex flex-col">
          <label for="mutuoEstinto" class="font-semibold ">Mutuo Estinto</label>
          <ToggleSwitch v-model="contratto.datiVenditaRequest.mutuoEstinto" />
        </div>
      </div>
    </div>
  </div>
</template>
