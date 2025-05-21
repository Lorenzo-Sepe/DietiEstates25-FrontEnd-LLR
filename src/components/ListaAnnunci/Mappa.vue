<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  defineProps,
  defineEmits,
  watch,
} from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter, useRoute } from "vue-router";

const props = defineProps(["luogo"]);

const router = useRouter();
const route = useRoute();

const contenitoreMappa = ref(null);
const istanzaMappa = ref(null);
const marcatore = ref(null);

onMounted(() => {
  inizializzaMappa();
  aggiornaMappa();
});

// Inizializza la mappa

const inizializzaMappa = () => {
  if (contenitoreMappa.value) {
    istanzaMappa.value = L.map(contenitoreMappa.value).setView(
      [40.8400998, 14.2500966],
      17,
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(istanzaMappa.value);
  }
};

// Aggiorna la mappa con il nuovo comune
const aggiornaMappa = async () => {
  if (props.luogo.latitudine && props.luogo.longitudine) {
    istanzaMappa.value.setView(
      [props.luogo.latitudine, props.luogo.longitudine],
      17,
    );

    //disegnaConfineCircolare();

    const datiConfine = await getDatiConfine();
    const relation = convertiDatiConfineToGeoJSON(datiConfine);
    disegnaConfine(relation);
  } else {
    console.warn("comune non trovato");
  }
};

const getDatiConfine = async () => {
  const overpassUrl = "https://overpass-api.de/api/interpreter";
  const comune = props.luogo.comune;

  const query = `
                    [out:json];
                    relation["boundary"="administrative"]["admin_level"="8"]["name"="${comune}"];
                    out geom;
                `;
  // Richiesta all'Overpass API
  const response = await fetch(overpassUrl, {
    method: "POST",
    body: query,
  });

  return await response.json();
};

const convertiDatiConfineToGeoJSON = (dati) => {
  const relation = dati.elements.find((el) => el.type === "relation");
  return relation;
};

const disegnaConfine = (relation) => {
  const geojson = {
    type: "Feature",
    geometry: {
      type: "MultiPolygon",
      coordinates: [],
    },
    properties: {
      name: props.luogo.comune,
    },
  };

  // Estrae le coordinate
  const coords = relation.members
    .filter((m) => m.type === "way" && m.geometry)
    .map((m) => m.geometry.map((p) => [p.lon, p.lat]));

  geojson.geometry.coordinates = [coords];

  // Rimuove eventuali cerchi precedenti
  if (marcatore.value) {
    istanzaMappa.value.removeLayer(marcatore.value);
  }

  // Disegna sulla mappa
  marcatore.value = L.geoJSON(geojson, {
    style: {
      color: "blue",
      weight: 2,
      fillOpacity: 0.1,
    },
  }).addTo(istanzaMappa.value);

  const bounds = marcatore.value.getBounds();

  setTimeout(() => {
    istanzaMappa.value.invalidateSize(); // forza il ridisegno
    istanzaMappa.value.fitBounds(bounds, { padding: [30, 30] });
  }, 500);
};

const disegnaConfineCircolare = () => {
  if (!istanzaMappa.value) return;

  // Rimuove eventuali cerchi precedenti
  if (marcatore.value) {
    istanzaMappa.value.removeLayer(marcatore.value);
  }

  // Crea e salva il nuovo cerchio
  marcatore.value = L.circle([route.query.lat, route.query.lon], {
    color: "green",
    fillColor: "#aaddff",
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
watch([() => props.luogo], () => {
  aggiornaMappa();
});
</script>

<template>
  <div
    ref="contenitoreMappa"
    class="z-1"
    style="height: 100%; width: 100%"
  ></div>
</template>
