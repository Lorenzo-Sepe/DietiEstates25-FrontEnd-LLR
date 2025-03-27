<template>
  <div class="flex px-3 flex-row justify-between items-center w-full top-0 h-25 z-50 sticky text-black text-2xl bg-white shadow-md">
    <LogoPortale v-if="isInPortale" />
    <Logo v-else class="p-3"/>

        <!-- Menu di Navigazione con prop -->
        <MenuNavigazione :isInPortale="isInPortale" />
    
        <Button label="Accedi" @click="openDialog"></Button>
        <Dialog v-model:visible="visible" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" modal header="Login">
          <LoginDialog @close="closeDialog"></LoginDialog>
        </Dialog>
  </div>
</template>

<script setup>
import Logo from "./Logo.vue"
import LogoPortale from "./LogoPortale.vue"
import MenuNavigazione from "./MenuNavigazione.vue";
import {  defineProps,ref } from 'vue'
import {useUserStore} from '../../stores/UserStore'
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import LoginDialog from "../Dialogs/LoginDialog.vue";

const visible = ref(false);

const props = defineProps({
    isInPortale: Boolean
  });
  

const userStoreInstance = useUserStore()

function openDialog(){
  visible.value = true;
} 

function closeDialog(){
  visible.value = false;
} 

</script>

