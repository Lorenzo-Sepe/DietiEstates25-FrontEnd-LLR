<template>
  <!-- Contenitore per la mappa -->
  <div ref="mapRef" style="width: 100%; height: 500px"></div>
</template>

<script>
import { ref, onMounted } from "vue";
import L from "leaflet";
import "leaflet-draw";
import iconMarker from "../assets/Icon/marker.png";

export default {
  name: "CircleDrawMap",
  mapName: "ApartmentMap",

  setup() {
    const mapRef = ref(null); // Riferimento al contenitore della mappa

    // Dati degli appartamenti (ad esempio, presi da un database)
    const apartments = [
      {
        id: 1,
        lat: 40.8522,
        lng: 14.2681,
        name: "Appartamento 1",
        price: "€100,000",
      },
      {
        id: 2,
        lat: 40.8535,
        lng: 14.27,
        name: "Appartamento 2",
        price: "€150,000",
      },
      {
        id: 3,
        lat: 40.856,
        lng: 14.2675,
        name: "Appartamento 3",
        price: "€200,000",
      },
      {
        id: 4,
        lat: 40.855,
        lng: 14.271,
        name: "Appartamento 4",
        price: "€180,000",
      },
      {
        id: 5,
        lat: 40.854,
        lng: 14.275,
        name: "Appartamento 5",
        price: "€220,000",
      },
    ];

    // Funzione di inizializzazione della mappa
    const initMap = () => {
      if (!mapRef.value) {
        console.error("Contenitore mappa non trovato");
        return;
      }

      // Crea la mappa
      const map = L.map(mapRef.value).setView([40.8518, 14.2681], 15);

      // Aggiungi il layer di Tile (mappa OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map,
      );

      //Personalizzazione marker
      const customIcon = L.icon({
        iconUrl: iconMarker, // Percorso dell'icona personalizzata
        iconSize: [32, 32], // Dimensioni dell'icona
        iconAnchor: [16, 32], // Punto di ancoraggio dell'icona
        popupAnchor: [0, -32], // Posizione del pop-up rispetto all'icona
      });

      // Aggiungi markers per ogni appartamento
      apartments.forEach((apartment) => {
        const marker = L.marker([apartment.lat, apartment.lng], {
          icon: customIcon,
        })
          .addTo(map)
          .bindPopup(`<b>${apartment.name}</b><br>Prezzo: ${apartment.price}`);
      });

      // Crea un FeatureGroup per contenere i disegni
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      // Aggiungi il controllo di disegno per il cerchio
      const drawControl = new L.Control.Draw({
        draw: {
          polygon: false,
          polyline: false,
          rectangle: false,
          circle: true, // Solo cerchi
          marker: false,
        },
        edit: {
          featureGroup: drawnItems,
        },
      });
      map.addControl(drawControl);

      // Evento che si attiva quando un cerchio viene creato
      map.on(L.Draw.Event.CREATED, (event) => {
        const layer = event.layer;
        drawnItems.addLayer(layer);

        if (event.layerType === "circle") {
          const center = layer.getLatLng();
          const radius = layer.getRadius();
        }
      });
    };

    // Inizializza la mappa dopo che il componente è montato
    onMounted(() => {
      initMap();
    });

    return {
      mapRef, // Passiamo il riferimento della mappa al template
    };
  },
};
</script>

<style scoped>
/* Eventuali stili personalizzati */
</style>
