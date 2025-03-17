<template>
    <div class="card">
      <Tabs value="0">
        <TabList>
          <Tab value="0">Login</Tab>
          <Tab value="1">Registrati</Tab>
        </TabList>
        <TabPanels class="mt-4 ">
          <TabPanel value="0">
            <form @submit.prevent="handleLogin" class="space-y-4">
              <input
                v-model="loginEmail"
                type="email"
                placeholder="Email"
                class="w-full p-2 border rounded"
              />
              <input
                v-model="loginPassword"
                type="password"
                placeholder="Password"
                class="w-full p-2 border rounded"
              />
              <button
                type="submit"
                class="w-full bg-green-500 text-white py-2 rounded"
              >
                Accedi
              </button>
            </form>
          </TabPanel>
          <TabPanel value="1">
            <form @submit.prevent="handleRegister" class="space-y-4">
              <input
                v-model="agencyName"
                type="text"
                placeholder="Nome Agenzia"
                class="w-full p-2 border rounded"
              />
              <input
                v-model="registerEmail"
                type="email"
                placeholder="Email"
                class="w-full p-2 border rounded"
              />
              <input
                v-model="registerPassword"
                type="password"
                placeholder="Password"
                class="w-full p-2 border rounded"
              />
              <button
                type="submit"
                class="w-full bg-blue-500 text-white py-2 rounded"
              >
                Registrati
              </button>
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Tabs from 'primevue/tabs';
  import TabList from 'primevue/tablist';
  import Tab from 'primevue/tab';
  import TabPanels from 'primevue/tabpanels';
  import TabPanel from 'primevue/tabpanel';
import AuthService from '../services/AuthService';
  
  const loginEmail = ref('');
  const loginPassword = ref('');
  const agencyName = ref('');
  const registerEmail = ref('');
  const registerPassword = ref('');
  
  const handleLogin = async () => {
    try {
      await AuthService.login(loginEmail.value, loginPassword.value);
      // Gestisci il successo del login (es. reindirizzamento)
    } catch (error) {
      // Gestisci l'errore (es. mostra un messaggio di errore)
      console.error('Login failed:', error);
    }
  };
  
  const handleRegister = async () => {
    try {
      await AuthService.register(agencyName.value, registerEmail.value, registerPassword.value);
      // Gestisci il successo della registrazione (es. reindirizzamento)
    } catch (error) {
      // Gestisci l'errore (es. mostra un messaggio di errore)
      console.error('Registration failed:', error);
    }
  };
  </script>
  
  <style>
  .card {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  </style>