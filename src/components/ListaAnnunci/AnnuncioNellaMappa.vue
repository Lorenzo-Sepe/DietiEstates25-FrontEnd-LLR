<script setup>
import { ref, onMounted, defineProps } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter, useRoute } from 'vue-router';



const props = defineProps(['latitudine', 'longitudine']);

const router = useRouter();
const route = useRoute()

const contenitoreMappa = ref(null);
const istanzaMappa = ref(null);
const marcatore = ref(null);

const customIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

onMounted(() => {

    inizializzaMappa();
    aggiornaMappa();
});

// Inizializza la mappa

const inizializzaMappa = () => {

    if (contenitoreMappa.value) {
        
        istanzaMappa.value = L.map(contenitoreMappa.value).setView([40.8400998, 14.2500966], 17);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap',
        }).addTo(istanzaMappa.value);
    }

}

// Aggiorna la mappa con il nuovo comune
const aggiornaMappa = async () => {

    istanzaMappa.value.setView([40.8400998, 14.2500966], 17);

    localizzaImmobile();
};

const localizzaImmobile = () => {

    if (!istanzaMappa.value) return;

    // Rimuove eventuali cerchi precedenti
    if (marcatore.value) {
        istanzaMappa.value.removeLayer(marcatore.value);
    }

    // Crea un nuovo marcatore
    marcatore.value = L.marker([40.8400998, 14.2500966], { icon: customIcon }).addTo(istanzaMappa.value);
};

</script>

<template>
    <div ref="contenitoreMappa" class="z-1" style="min-height: 30rem; height: 100%; width: 100%"></div>
</template>
