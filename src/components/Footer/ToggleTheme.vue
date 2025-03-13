<template>
    <div class="flex flex-col justify-center items-center gap-1">
        <span >Selettore tema </span>
        <ToggleSwitch v-model="isDarkMode" >
            <template #handle="{ checked }">
                <i :class="['!text-xs pi ', { 'pi-sun': !checked, 'pi-moon': checked }]" />
            </template>
        </ToggleSwitch>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import ToggleSwitch from 'primevue/toggleswitch';
  
  const isDarkMode = ref(localStorage.getItem('theme') === 'dark');
  
  const applyTheme = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('my-app-dark');
    } else {
      document.documentElement.classList.remove('my-app-dark');
    }
  };
  
  watch(isDarkMode, (newValue) => {
    applyTheme();
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  });
  
  onMounted(() => {
    applyTheme();
  });
  </script>
  