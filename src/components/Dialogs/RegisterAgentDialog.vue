<template>
    <RegisterAgent @close="$emit('close')" class="rounded"/>
  </template>
  
  <script setup>
  import RegisterAgent from '../Logins/RegisterAgent.vue'; 
  import { defineEmits } from 'vue';
  
  const emit= defineEmits(["close"])  
  
  </script>