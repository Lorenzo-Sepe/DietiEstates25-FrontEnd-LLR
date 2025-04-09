<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps, defineEmits, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter, useRoute } from 'vue-router';



const props = defineProps(['raggio'])

const router = useRouter();
const route = useRoute()

const contenitoreMappa = ref(null);
const istanzaMappa = ref(null);
const marcatore = ref(null);

onMounted(() => {

    inizializzaMappa();
    aggiornaMappa();
});

// Inizializza la mappa

const inizializzaMappa = () => {

    try {

        istanzaMappa.value = L.map('mappa').setView([41.8719, 12.5674], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap',
        }).addTo(istanzaMappa.value);

    } catch (error) {

        const mappaContainer = document.getElementById('mappa');
        L.DomUtil.remove(mappaContainer)

        istanzaMappa.value = L.map('mappa').setView([41.8719, 12.5674], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap',
        }).addTo(istanzaMappa.value);

    }

}

// Aggiorna la mappa con il nuovo comune
const aggiornaMappa = async () => {

    if (route.query.lat && route.query.lon) {

        istanzaMappa.value.setView([route.query.lat, route.query.lon], 17);

        disegnaConfineCircolare();

    } else {

        console.warn('comune non trovato');
    }

};

const disegnaConfineCircolare = () => {

    if (!istanzaMappa.value) return;

    // Rimuove eventuali cerchi precedenti
    if (marcatore.value) {
        istanzaMappa.value.removeLayer(marcatore.value);
    }

    // Crea e salva il nuovo cerchio
    marcatore.value = L.circle([route.query.lat, route.query.lon], {
        color: 'green',
        fillColor: '#aaddff',
        fillOpacity: 0.3,
        radius: props.raggio * 1000,
    }).addTo(istanzaMappa.value);

    // Centra la mappa sul cerchio
    istanzaMappa.value.setView([route.query.lat, route.query.lon], 13);

    const bounds = marcatore.value.getBounds();

    setTimeout(() => {
        istanzaMappa.value.invalidateSize(); // forza il ridisegno
        istanzaMappa.value.fitBounds(bounds, { padding: [30, 30] });
    }, 500);
};

// Quando cambia comune, aggiorniamo la mappa
watch([() => props.raggio], () => {

    aggiornaMappa();
});

</script>

<template>
    <div id="mappa" ref="contenitoreMappa" class="z-1" style="height: 100%; width: 100%;"></div>
</template>
