<template>
  <div class="flex px-3 flex-row justify-between items-center w-full top-0 h-auto z-50 sticky text-black text-2xl bg-surface-200/95">
    <LogoPortale v-if="dipendente.value" />
    <Logo v-else class="p-3"/>
    
    <Button label="Accedi" raised />
  </div>
</template>

<script setup>
import Logo from "./Logo.vue"
import LogoPortale from "./LogoPortale.vue"
import { ref } from 'vue'
import {useUserStore} from '../../stores/UserStore'
import { useEmployeeStore } from "../../stores/EmployeeStore"
import Button from 'primevue/button';
const employeeStoreInstance = useEmployeeStore()

const dipendente = ref(employeeStoreInstance.employee.token);

</script>


