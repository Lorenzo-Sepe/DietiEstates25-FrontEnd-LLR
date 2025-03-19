<template>
  <div class="flex px-3 bg-surface-0 flex-row justify-between items-center w-full top-0 h-auto z-50 sticky text-black text-2xl ">
    <LogoPortale v-if="isInPortale" />
    <Logo v-else class="p-3"/>

        <!-- Menu di Navigazione con prop -->
        <MenuNavigazione :isInPortale="isInPortale" />
    
    <Button label="Accedi" raised />
  </div>
</template>

<script setup>
import Logo from "./Logo.vue"
import LogoPortale from "./LogoPortale.vue"
import MenuNavigazione from "./MenuNavigazione.vue";

import {  defineProps } from 'vue'
import {useUserStore} from '../../stores/UserStore'

import Button from 'primevue/button';


const props = defineProps({
    isInPortale: Boolean
  });
  

const userStoreInstance = useUserStore()


</script>


