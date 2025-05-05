<template>

    <Dialog v-model:visible="loadingOperazione" modal header="OPERAZIONE IN CORSO" :style="{ width: 'auto' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="card flex justify-center">
            <ProgressSpinner />
        </div>
    </Dialog>

    <Dialog v-model:visible="okAllert" modal header="CONFERMA OPERAZIONE" :style="{ width: 'auto' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <p class="m-0">
            Operazione conclusa con successo
        </p>
        <Button label="OK" @click="okAllert = false" />
    </Dialog>

    <Dialog v-model:visible="erroreAllert" modal header="ERRORE" :style="{ width: 'auto' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <p class="m-0">
            Errore di rete, riprovare più tardi.
        </p>
        <Button label="OK" @click="erroreAllert = false" />
    </Dialog>

    <Dialog v-model:visible="contenutoNotifica" modal :style="{ width: '40rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">

        <div v-html="contenutoHtml"></div>

        <div>
            <div class="flex justify-center border-t-2 border-black w-full mx-auto my-2"></div>
            <div v-if="isAttivoCategoriaNotificaVisualizzata">
                <p>Questa notifica appartiene alla categoria <Tag severity="secondary"> {{
                    nomeCategoriaNotificaVisualizzata }} </Tag>, se non vuoi ricevere ultetiori notifiche di questa
                    categoria clicca disattiva</p>
                <Button severity="secondary" @click="clickAttivaOrDisattivaCategoria">Disattiva {{
                    nomeCategoriaNotificaVisualizzata }}</Button>
            </div>
            <div v-else>
                <p class="!text-red-500">Attenzione, la notifica che stai visualizzando appartiene alla categoria <Tag
                        severity="secondary"> {{ nomeCategoriaNotificaVisualizzata }} </Tag>. Questa categoria è
                    disattivata pertanto non stai ricevendo ulteriori notifiche di questa categoria</p>
                <Button severity="success" @click="clickAttivaOrDisattivaCategoria"> Attiva {{
                    nomeCategoriaNotificaVisualizzata }}</Button>
            </div>

        </div>

    </Dialog>

    <div class="flex flex-row p-4 items-start gap-4 w-full">
        <div class="contenitore-menuLaterale border-2 border-black rounded-lg my-10 hidden md:block">
            <MenuLaterale :categorie="categorieNotifiche" :categoriaSelected="categoriaSelected"
                @modificaSottoscrizioni="modificaSottoscrizioni" />
        </div>
        <div class="contenitore-notifiche p-2 flex flex-col gap-4">
            <div class="flex md:hidden border-1 border-gray-500 rounded-lg p-4 justify-center gap-4 w-auto">
                <MenuCategoriaSuperiore :categorie="categorieNotifiche"  @modificaSottoscrizioni="modificaSottoscrizioni" />
            </div>
            <span v-if="numeroNotifche<1" class="text-2xl">Non hai ricevuto nessuna notifica</span>
            <ListaNotifiche v-else :notifiche="notifiche" @visualizzaNotifica="visualizzaNotifica" />
            <div class="mt-auto">
                <Paginator :rows="5" :totalRecords="numeroNotifche" @page="onPage"></Paginator>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import NotificheService from '../services/NotificheService.js';
import { useRouter, useRoute } from 'vue-router';

import MenuLaterale from '../components/Notifiche/MenuLaterale.vue';
import MenuCategoriaSuperiore from '../components/Notifiche/MenuCategoriaSuperiore.vue';
import ListaNotifiche from '../components/Notifiche/ListaNotifiche.vue';
import Paginator from 'primevue/paginator';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

import { CategoriaNotificaRequest } from '../dto/CategoriaNotificaRequest.js';

const categorieNotifiche = ref([]);

const router = useRouter();
const route = useRoute();

const numeroNotifche = ref();
const notifiche = ref();

const okAllert = ref(false);
const erroreAllert = ref(false);
const loadingOperazione = ref(false);
const contenutoNotifica = ref(false);

const contenutoHtml = ref('');

const isAttivoCategoriaNotificaVisualizzata = ref(false);
const nomeCategoriaNotificaVisualizzata = ref('');
const idCategoriaNotificaVisualizzata = ref(0);

onMounted(async () => {

    router.push({

        path: route.path,
        query: { ...route.query, nome: 'Tutte le notifiche', pagina: 0, id: 0 }
    });


    try {

        categorieNotifiche.value = await NotificheService.getSottoscrizioni();

        console.log("sottoscrizioniNotifiche:", categorieNotifiche.value);

    } catch (error) {

        console.log("errore chaimata get sottoscrizioni:", error);

    }

    numeroNotifche.value = getNumeroNotifiche();
    notifiche.value = getNotifiche();

})

const getNumeroNotifiche = async () => {

    if (route.query.id == 0) {

        try {

            numeroNotifche.value = await NotificheService.getNumeroNotifiche();
            console.log("numeroNotifiche:", numeroNotifche.value);

        } catch (error) {

            console.log("errore chiamata get numero notifiche:", error);
        }

    } else {

        try {

            numeroNotifche.value = await NotificheService.getNumeroNotificheByCategoria(route.query.id);
            console.log("numeroNotifiche:", numeroNotifiche.value);

        } catch (error) {

            console.log("errore chiamata get numero notifiche:", error);
        }
    }
}

const getNotifiche = async () => {

    if (route.query.id == 0) {
        try {

            notifiche.value = await NotificheService.getNotifiche(route.query.pagina);
            console.log("notifiche:", notifiche.value);

        } catch (error) {

            console.log("errore chiamata get notifiche:", error);

        }
    } else {

        try {

            notifiche.value = await NotificheService.getNotificheByCategoria(route.query.pagina, route.query.id);
            console.log("notifiche:", notifiche.value);

        } catch (error) {

            console.log("errore chiamata get notifiche:", error);

        }
    }
}

const onPage = (event) => {

    router.push({
        path: route.path,
        query: { ...route.query, pagina: event.page }
    });
}

watch(() => route.query, () => {
    numeroNotifche.value = getNumeroNotifiche();
    notifiche.value = getNotifiche();
}, { deep: true }); // deep: true serve per rilevare cambiamenti negli oggetti complessi

const modificaSottoscrizioni = async () => {

    const listaCategorieNotificaRequest = ref([]);

    categorieNotifiche.value.forEach(categoria => {

        const categoriaNotificaRequest = reactive(new CategoriaNotificaRequest(categoria));

        listaCategorieNotificaRequest.value.push({ ...categoriaNotificaRequest });

    });

    try {

        loadingOperazione.value = true;
        await NotificheService.modificaSottoscrizioniCategorie(listaCategorieNotificaRequest.value);
        loadingOperazione.value = false;
        isAttivoCategoriaNotificaVisualizzata.value = !isAttivoCategoriaNotificaVisualizzata.value;
        okAllert.value = true;

    } catch (error) {

        erroreAllert.value = true;
    }
}

const visualizzaNotifica = (notifica) => {

    contenutoHtml.value = notifica.contenuto;
    isAttivoCategoriaNotificaVisualizzata.value = isAttivo(notifica.idCategoria);
    nomeCategoriaNotificaVisualizzata.value = getNomeCategoria(notifica.idCategoria);
    idCategoriaNotificaVisualizzata.value = notifica.idCategoria;
    contenutoNotifica.value = true;
    try{

        NotificheService.setVisualizzazioneNotifica(notifica.id).then(() => {

            console.log("notifica visualizzata correttamente");

        }).catch(error => {

            console.log("errore chiamata visualizza notifica:", error);
        });

    }catch(error){

        console.log("errore chiamata check notifica:", error);
    }
}

const getNomeCategoria = (idCategoria) => {

    for (const categoria of categorieNotifiche.value) {

        if (categoria.idCategoria === idCategoria) {

            return categoria.nomeCategoria;
        }
    }
}

const isAttivo = (idCategoriaNotificaVisualizzata) => {

    for (const categoria of categorieNotifiche.value) {

        if (categoria.idCategoria === idCategoriaNotificaVisualizzata) {

            return categoria.attivo;
        }
    }
}

const clickAttivaOrDisattivaCategoria = () => {

    categorieNotifiche.value.forEach(categoria => {

        if (categoria.idCategoria === idCategoriaNotificaVisualizzata.value) {

            categoria.attivo = !categoria.attivo;
        }
    });

    modificaSottoscrizioni();
}

</script>

<style scoped>
.contenitore-menuLaterale {

    width: 24rem;
    padding: 1rem;
}

.contenitore-notifiche {

    width: 70%;
}

@media (max-width: 768px) {
    .contenitore-notifiche {
        width: 100%;
    }
}
</style>