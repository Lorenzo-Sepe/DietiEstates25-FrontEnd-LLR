<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw'; // Questo estende direttamente L
import { useRouter, useRoute } from 'vue-router';

import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps(['annunci', 'loading'])

const router = useRouter();
const route = useRoute()

const contenitoreMappa = ref(null);
const istanzaMappa = ref(null);
const marcatore = ref(null);
let drawCircle = null;

const iconaAnnuncio = L.icon({
    iconUrl: '../assets/Icon/marker.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

onMounted(() => {

    inizializzaMappa();

    istanzaMappa.value.on(L.Draw.Event.CREATED, function (event) {
        const layer = event.layer;

        if (event.layerType === 'circle') {
            const latLng = layer.getLatLng();
            const radius = layer.getRadius();

            console.log('Cerchio disegnato:', latLng, 'raggio:', radius);

            if (marcatore.value) {
                istanzaMappa.value.removeLayer(marcatore.value);
            }

            marcatore.value = layer;
            layer.addTo(istanzaMappa.value);

            router.push({

                path: '/mappa-annunci',
                query: {
                    ...route.query,
                    lat: latLng.lat,
                    lon: latLng.lng,
                    raggio: radius / 1000, // Converti il raggio in km
                }
            })
        }
    });
});


const inizializzaMappa = () => {

    if (contenitoreMappa.value) {

        istanzaMappa.value = L.map(contenitoreMappa.value).setView([40.8400998, 14.2500966], 17);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap',
        }).addTo(istanzaMappa.value);

        // Prepara il tool cerchio ma non lo mostra ancora
        drawCircle = new L.Draw.Circle(istanzaMappa.value, {
            shapeOptions: {
                color: 'green',
                fillColor: '#aaddff',
                fillOpacity: 0.3,
            },
        });
    }

}

const attivaDisegnoCerchio = () => {
    if (drawCircle) {
        drawCircle.enable();
    }
};

const rimuoviCerchio = () => {
    if (marcatore.value) {
        istanzaMappa.value.removeLayer(marcatore.value);
        marcatore.value = null;
    }
    router.push({

        path: '/mappa-annunci',
        query: {
            ...route.query,
            lat: null,
            lon: null,
            raggio: null
        }
    })
};

const aggiornaMarker = () => {

    // Rimuovi i vecchi marker
    markersAnnunci.value.forEach(marker => {
        istanzaMappa.value.removeLayer(marker);
    });
    markersAnnunci.value = [];

    // Aggiungi nuovi marker
    annunci.forEach(annuncio => {
        const marker = L.marker([annuncio.latitudine, annuncio.longitudine],{ icon: iconaAnnuncio })
            .addTo(istanzaMappa.value)
            .bindPopup(`<b>${annuncio.titolo}</b><br>€ ${annuncio.prezzo.toLocaleString()}`);

        markersAnnunci.value.push(marker);
    });
}

watch([() => props.annunci], () => {

    aggiornaMarker();
});

</script>

<template>
    <div class="relative h-full w-full">
        <div ref="contenitoreMappa" class="z-1 h-full w-full"></div>

        <div v-if="props.loading" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
            <ProgressSpinner style="width: 64px; height: 64px" strokeWidth="8" fill="transparent"
                animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        </div>

        <div class="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 flex flex-row gap-2">

            <button @click="attivaDisegnoCerchio"
                class="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 cursor-pointer">
                Disegna cerchio
            </button>
            <button @click="rimuoviCerchio"
                class="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 cursor-pointer">
                Rimuovi cerchio
            </button>

        </div>
    </div>
</template>