<template>
        <Fluid class="flex flex-col gap-[1rem] justify-around">
            <div class="flex flex-row gap-[1rem]">
                <ToggleVenditaAffitto />
                <SelectTipoImmobile class="min-w-41"/>
                <InputRicerca class="w-full" />
            </div>
        <Button  label="Cerca" icon="pi pi-search" />
        </Fluid>
</template>

<script setup>
import  Fluid  from "primevue/fluid"
import InputRicerca from "../Homepage/InputRicerca.vue"
import SelectTipoImmobile from "../Homepage/SelectTipoImmobile.vue"
import ToggleVenditaAffitto from "../Homepage/ToggleVenditaAffitto.vue"
import Button from "primevue/button"
</script>