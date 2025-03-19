<template>
    <div>
      <input
        type="text"
        v-model="address"
        @keyup.enter="updateMap"
        placeholder="Inserisci un indirizzo"
      />
      <div id="map" ref="map" style="height: 400px; width: 100%;"></div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
  
  export default {
    name: 'MapComponent',
    setup() {
      const address = ref('');
      const map = ref(null);
      const marker = ref(null);
  
      const initMap = () => {
  map.value = L.map('map').setView([41.8719, 12.5674], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
  }).addTo(map.value);

  const geocoder = L.Control.geocoder({
    defaultMarkGeocode: false,
  })
  .on('markgeocode', function(e) {
    const latlng = e.geocode.center;
    map.value.setView(latlng, 13);
    if (marker.value) {
      map.value.removeLayer(marker.value);
    }
    marker.value = L.marker(latlng).addTo(map.value);
  })
  .addTo(map.value);
};
  
      const updateMap = () => {
        const geocoder = new L.Control.Geocoder.Nominatim();
        geocoder.geocode(address.value, (results) => {
          if (results && results.length > 0) {
            const location = results[0].center;
            map.value.setView(location, 13);
            if (marker.value) {
              map.value.removeLayer(marker.value);
            }
            marker.value = L.marker(location).addTo(map.value);
          } else {
            alert('Indirizzo non trovato');
          }
        });
      };
  
      onMounted(() => {
        initMap();
      });
  
      onBeforeUnmount(() => {
        if (map.value) {
          map.value.remove();
        }
      });
  
      return {
        address,
        updateMap,
      };
    },
  };
  </script>
  
  <style>
  #map {
    height: 400px;
    width: 100%;
  }
  </style>