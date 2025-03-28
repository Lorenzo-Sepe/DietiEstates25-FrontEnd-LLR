<template>

    <Dialog v-model:visible="impostazioniSottoscrizineVisibe" modal :style="{ width: 'auto' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <template #container="{ closeCallback }">
            <div class="flex flex-col p-4">
                <h2 class="text-lg font-bold">DISATTIVA/ATTIVA NOTIFICHE</h2>
                <ImpostazioniSottoscrizioni :categorie="props.categorie"
                    :dialogSottoscrizioni="impostazioniSottoscrizineVisibe" @chiudiImpostazioni="closeCallback"
                    @modificaSottoscrizioni="emit('modificaSottoscrizioni')" />
            </div>
        </template>
    </Dialog>

    <div
        class="riga-tutteLeNotifiche flex justify-between items-center p-1 gap-4 w-full hover:bg-[#ECFDF5]/60! cursor-pointer">
        <span @click="clickTutteLeCategorie">Tutte le tue notifiche</span>
        <Button variant="text" rounded aria-label="Filter" @click="impostazioniSottoscrizineVisibe = true"
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
                        @modificaSottoscrizione="modificaSottoscrizione" />

                    <div class="flex flex-col items-start my-4">
                        <label class="font-bold">Categorie disattivate</label>
                        <div class="border-t-2 border-black w-full mx-auto my-2"></div>
                        <CategoriaMenuLaterale v-for="categoria in filteredCategorieDisattivate" :categoria="categoria"
                            @modificaSottoscrizione="modificaSottoscrizione" />
                    </div>

                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </div>

</template>

<script setup>
import { ref, defineProps, defineEmits, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import 'primeicons/primeicons.css'


import CategoriaMenuLaterale from '../Notifiche/CategoriaMenuLaterale.vue';
import ImpostazioniSottoscrizioni from '../Notifiche/ImpostazioniSottoscrizioni.vue';

const accordionChiuso = ref(null);
const props = defineProps(['categorie']);
const emit = defineEmits(['modificaSottoscrizioni']);

const router = useRouter();
const route = useRoute();

const impostazioniSottoscrizineVisibe = ref(false);

onMounted(() => {


});


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

const clickTutteLeCategorie = () => {

    router.push({
        path: route.path,
        query: { ...route.query, nome: "Tutte le categorie", id: 0, pagina: 0 }
    });
}

const modificaSottoscrizione = (idCategoria) => {

    console.log("sono nel log");

    props.categorie.forEach(categoria => {

        if (categoria.idCategoria === idCategoria) {

            categoria.attivo = !categoria.attivo;
        }
    });

    emit('modificaSottoscrizioni');
}

</script>