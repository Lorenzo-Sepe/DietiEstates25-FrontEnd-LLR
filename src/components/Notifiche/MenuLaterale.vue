<template>

    <div
        class="riga-tutteLeNotifiche flex justify-between items-center p-1 gap-4 w-full hover:bg-[#ECFDF5]/60! cursor-pointer">
        <span>Tutte le tue notifiche</span>
        <Button variant="text" rounded aria-label="Filter"
            v-tooltip="{ value: 'Impostazioni sottoscrizioni', showDelay: 300, hideDelay: 300 }">
            <template #icon>
                <img src="../../assets/Icon/menuSottoscrizione.png" class="w-5 h-5" />
            </template>
        </Button>
    </div>
    <div class="card my-4">
        <Accordion v-model:activeIndex="accordionChiuso" @update:activeIndex="onAccordionChange">
            <AccordionPanel>
                <AccordionHeader>{{ getTitle() }}</AccordionHeader>
                <AccordionContent class="text-left items-start">
                    <CategoriaMenuLaterale v-for="categoria in filteredCategorieAttive" :categoria="categoria"
                        @click="clickCategoria(categoria.nomeCategoria, categoria.idCategoria)" />

                    <div class="flex flex-col items-start my-4">
                        <label class="font-bold">Categorie disattivate</label>
                        <div class="border-t-2 border-black w-full mx-auto my-2"></div>
                        <CategoriaMenuLaterale v-for="categoria in filteredCategorieDisattivate" :categoria="categoria"
                            @click="clickCategoria(categoria.nomeCategoria, categoria.idCategoria)" />
                    </div>

                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </div>

</template>

<script setup>
import { ref, defineProps, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Button from 'primevue/button';
import 'primeicons/primeicons.css'


import CategoriaMenuLaterale from '../Notifiche/CategoriaMenuLaterale.vue';

const accordionChiuso = ref(null);
const props = defineProps(['categorie']);

const router = useRouter();
const route = useRoute();


const getTitle = () => {

    return accordionChiuso.value === 0 ? "Lista categorie" : "Categorie attive";
};

const onAccordionChange = (index) => {

    accordionChiuso.value = index;
};


const filteredCategorieAttive = computed(() => {

    return props.categorie.filter(categoria => categoria.attivo);

});

const filteredCategorieDisattivate = computed(() => {

    return props.categorie.filter(categoria => !categoria.attivo);

});

const clickCategoria = (nomeCategoria, idCategoria) => {

    router.push({
        path: route.path,
        query: { ...route.query, nome: nomeCategoria, id: idCategoria, pagina: 0 }
    });
}

</script>