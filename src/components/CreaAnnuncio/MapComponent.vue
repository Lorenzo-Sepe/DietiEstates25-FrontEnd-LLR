<template>
    <div>
      <input
        type="text"
        v-model="indirizzo"
        @keyup.enter="aggiornaMappa"
        placeholder="Inserisci un indirizzo"
      />
      <button @click="forzaRidisegnoMappa">Forza Ridisegno Mappa</button>
      <div id="mappa" ref="contenitoreMappa" style="height: 400px; width: 100%;"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, defineProps ,watch} from 'vue';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
  import 'leaflet-control-geocoder';
  
  // Define props and emits
const props = defineProps({
  activeStep: Number
});
watch(() => props.activeStep, (newValue, oldValue) => {
  if(newValue === 2) {
    forzaRidisegnoMappa();
  }
});

  const indirizzo = ref('');
  const contenitoreMappa = ref(null); // riferimento all'elemento DOM
  const istanzaMappa = ref(null);      // riferimento all'istanza Leaflet
  const marcatore = ref(null);
  
  const inizializzaMappa = () => {
    // Crea la mappa usando l'ID dell'elemento DOM
    istanzaMappa.value = L.map('mappa').setView([41.8719, 12.5674], 5);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(istanzaMappa.value);
  
    const geocodificatore = L.Control.geocoder({
      defaultMarkGeocode: false,
    })
      .on('markgeocode', (evento) => {
        const latlng = evento.geocode.center;
        istanzaMappa.value.setView(latlng, 13);
        if (marcatore.value) {
          istanzaMappa.value.removeLayer(marcatore.value);
        }
        marcatore.value = L.marker(latlng).addTo(istanzaMappa.value);
      })
      .addTo(istanzaMappa.value);
  
    forzaRidisegnoMappa();
  };
  
  const forzaRidisegnoMappa = () => {
    const elementoMappa = document.getElementById('mappa');
    const altezzaOriginale = elementoMappa.style.height;
    const larghezzaOriginale = elementoMappa.style.width;
  
    elementoMappa.style.height = '401px';
    setTimeout(() => {
      elementoMappa.style.height = altezzaOriginale;
      elementoMappa.style.width = larghezzaOriginale;
      istanzaMappa.value.invalidateSize();
    }, 100);
  };
  
  const aggiornaMappa = () => {
    const geocodificatore = new L.Control.Geocoder.Nominatim();
    geocodificatore.geocode(indirizzo.value, (risultati) => {
      if (risultati && risultati.length > 0) {
        const posizione = risultati[0].center;
        istanzaMappa.value.setView(posizione, 13);
        if (marcatore.value) {
          istanzaMappa.value.removeLayer(marcatore.value);
        }
        marcatore.value = L.marker(posizione).addTo(istanzaMappa.value);
        forzaRidisegnoMappa();
      } else {
        alert('Indirizzo non trovato');
      }
    });
  };
  
  onMounted(() => {
    inizializzaMappa();
  });
  
  onBeforeUnmount(() => {
    if (istanzaMappa.value) {
      istanzaMappa.value.remove();
    }
  });
  </script>
  
  <style>
  #mappa {
    height: 400px;
    width: 100%;
  }
  </style>
  