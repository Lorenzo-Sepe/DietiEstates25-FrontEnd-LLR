<template>
  <div class="flex px-3 flex-row justify-between items-center w-full top-0 h-auto z-50 sticky text-black text-2xl bg-gray-200">
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

import { ref, defineProps } from 'vue'
import {useUserStore} from '../../stores/UserStore'
import { useEmployeeStore } from "../../stores/EmployeeStore"
import Button from 'primevue/button';
const employeeStoreInstance = useEmployeeStore()

const props = defineProps({
    isInPortale: Boolean
  });
  

const userStoreInstance = useUserStore()

const dipendente = ref(userStoreInstance.user.dipendente);

</script>


