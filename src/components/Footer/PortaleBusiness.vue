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
                    <Button class="mb-2" label="Registra la tua agenzia" severity="contrast" raised />    
                </li>
                
            </ul>
            
        </div>
    </div>
</template>

<script setup>
import Button from 'primevue/button';
import { ref } from 'vue';

const visibility=ref(false);

function changeVisibility(){
    visibility.value=!visibility.value;
};

</script>