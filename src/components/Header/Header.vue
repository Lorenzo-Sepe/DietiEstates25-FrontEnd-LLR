<template>
  <div class="flex px-3 flex-row justify-between items-center w-full bg-white top-0 h-auto z-50 sticky text-black text-2xl">
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
import Button from 'primevue/button';

const userStoreInstance = useUserStore()

const dipendente = ref(userStoreInstance.user.dipendente);

</script>


