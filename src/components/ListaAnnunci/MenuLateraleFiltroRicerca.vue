<template>
    <div class="card flex justify-center">
        <Drawer v-model:visible="visible">
            <template #container="{ closeCallback }">
                <div class="flex flex-col h-full">
                    <div class="flex items-center justify-between px-6 pt-4 shrink-0">
                        <span class="inline-flex items-center gap-2">
                            <span class="font-semibold text-2xl text-primary">Filtro Ricerca</span>
                        </span>
                        <span>
                            <Button type="button" @click="closeCallback" icon="pi pi-times" rounded outlined></Button>
                        </span>
                    </div>
                    <div class="overflow-y-auto">
                        mettere il contenuto del menu qui
                    </div>
                </div>
            </template>
        </Drawer>
        <Button icon="pi pi-bars" @click="visible = true" />
    </div>
</template>

<script setup>
import { ref } from "vue";

import Drawer from 'primevue/drawer';
import Button from "primevue/button";

const visible = ref(false);
</script>
