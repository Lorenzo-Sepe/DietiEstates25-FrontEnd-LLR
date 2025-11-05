<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10">
    <div class="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
      <h1 class="text-3xl font-bold text-center text-gray-800">
        Benvenuto nel nostro Portale Immobiliare
      </h1>

      <p class="mt-4 text-gray-600 text-center leading-relaxed">
        Benvenuto sul nostro portale, dedicato alle agenzie immobiliari e ai
        loro agenti. Qui puoi pubblicare i tuoi annunci e raggiungere un sacco
        di potenziali acquirenti. Gli utenti possono sfogliare gli annunci e
        inviare una proposta che include l’offerta economica e i contatti per
        essere ricontattati. In questo modo, comprare o vendere diventa davvero
        semplice e veloce.
      </p>

      <div class="mt-8">
        <Tabs v-model:value="activeTab">
          <TabList class="flex justify-center border-b border-gray-200">
            <Tab
              :value="0"
              class="px-6 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
            >
              Login
            </Tab>
            <Tab
              :value="1"
              class="px-6 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
            >
              Registra la tua agenzia
            </Tab>
          </TabList>

          <TabPanels class="mt-6">
            <TabPanel :value="0">
              <Login />
            </TabPanel>
            <TabPanel :value="1">
              <AgencyRegistration />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import AgencyRegistration from "../components/Logins/AgencyRegistration.vue";
import Login from "../components/Logins/Login.vue";
import { useEmployeeStore } from "../stores/EmployeeStore";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  // accetta numero o stringa, default prima tab (0)
  initialTab: { type: [Number, String], default: 0 }
});

const activeTab = ref(props.initialTab);

// se la prop cambia dall'esterno, aggiorna la variabile attiva
watch(() => props.initialTab, (val) => {
  activeTab.value = val;
});

const router = useRouter();
const storeEmployee = useEmployeeStore();

onMounted(async () => {
  
  if (storeEmployee.isAutenticato) {
    router.push({ name: "MieiAnnunci" });
  }
  
});

</script>
