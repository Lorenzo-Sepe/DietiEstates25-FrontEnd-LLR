<template>
    <div class="card">

<Tabs value="0">
    <TabList>
      <Tab value="0">Login</Tab>
      <Tab value="1">Registrati</Tab>
    </TabList>
    <TabPanels class="mt-4 ">
      <TabPanel value="0">
        <form class="space-y-4">
          <input
            type="email"
            placeholder="Email"
            class="w-full p-2 border rounded"
          />
          <input
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
        <form class="space-y-4">
          <input
            type="text"
            placeholder="Nome Agenzia"
            class="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            class="w-full p-2 border rounded"
          />
          <input
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
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
</script>

<style>
.card {
padding: 20px;
border-radius: 8px;
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>