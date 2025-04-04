<template>
    <div>
        <h4 class="font-bold">Area Agenzie</h4>
        <div class="text-sm">

            <ul>
                <li>
                    <RouterLink to="/loginAgent">
                        <Button  class="mb-2" label="Accedi come agente immobiliare" raised/>
                    </RouterLink>
                
                </li>
                <li> 
                    <RouterLink to="/register-agency">
                        <Button class="mb-2" label="Registra la tua agenzia" severity="contrast" raised />
                    </RouterLink>
                </li>
                
            </ul>
            
        </div>
        
    </div>
</template>

<script setup>
import Button from 'primevue/button';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

/*
<Dialog v-model:visible="visible" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" modal header="Login">
          <LoginAgentDialog @close="closeDialog"></LoginAgeDialog>
        </Dialog>
*/
const visibility=ref(false);

function changeVisibility(){
    visibility.value=!visibility.value;
};

</script>