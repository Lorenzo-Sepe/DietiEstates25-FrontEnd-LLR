<template>
    <div class="flex flex-row p-4 item-start gap-4 w-full">
        <div class="contenitore-menuLaterale border-2 border-black rounded-lg hidden md:block">
            <MenuLaterale :categorie="categorieNotifiche" :categoriaSelected="categoriaSelected" />
        </div>
        <div class="contenitore-notifiche p-2 flex flex-col gap-4">
            <ListaNotifiche :notifiche="notifiche" />
            <div class="mt-auto">
                <Paginator :rows="5" :totalRecords="numeroNotifche" @page="onPage"></Paginator>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import NotificheService from '../services/NotificheService.js';
import { useUserStore } from '../stores/UserStore.js'
import { useRouter, useRoute } from 'vue-router';

import MenuLaterale from '../components/Notifiche/MenuLaterale.vue';
import ListaNotifiche from '../components/Notifiche/ListaNotifiche.vue';
import Paginator from 'primevue/paginator';

const userStore = useUserStore();
const categorieNotifiche = ref([]);

const router = useRouter();
const route = useRoute();

const numeroNotifche = ref();
const notifiche = ref();

onMounted(async () => {

    router.push({

        path: route.path,
        query: { ...route.query, nome: 'Tutte le notifiche', pagina: 0, id: 0 }
    });

    userStore.initializeStore()

    const userStruct = {

        id: 1,
        email: 'roby98@gmail.com',
        username: 'roby98',
        urlFotoProfilo: 'https://dieti24.blob.core.windows.net/upload/annuncio8-0-2025-03-05.png',
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkaWV0aWVzdGF0ZXMyNSIsInN1YiI6InJvYnk5OCIsImlhdCI6MTc0MjgzMTc5MCwiZXhwIjoxNzQyOTE4MTkwfQ.c9h3kZ15alkwbCzGj7U2MVIevrsQIZVJc5XClDq-AyI',
        authority: 'MEMBER',
        isAuthenticated: true
    }

    userStore.setUser(userStruct);

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

</script>

<style scoped>
.contenitore-menuLaterale {

    width: auto;
    padding: 1rem;
}

.contenitore-notifiche {

    width: 70%;
}
</style>