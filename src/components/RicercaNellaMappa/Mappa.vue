<script setup>
import { ref, onMounted, defineProps, watch, onBeforeUnmount } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw"; // Questo estende direttamente L
import { useRouter, useRoute } from "vue-router";

import ProgressSpinner from "primevue/progressspinner";
import Tag from "primevue/tag";

import { AnnuncioImmobiliareResponse } from "../../dto/Response/AnnuncioImmobiliareResponse";

import Galleria from "../ListaAnnunci/Galleria.vue";

const props = defineProps(["annunci", "loading", "filtro"]);

const router = useRouter();
const route = useRoute();

const contenitoreMappa = ref(null);
const istanzaMappa = ref(null);
const marcatore = ref(null);
let drawCircle = null;
const markersAnnunci = ref([]);
const mostraPopupAnnuncio = ref(false);
const annuncioSelezionato = ref(new AnnuncioImmobiliareResponse());

import markerIconUrl from "../../assets/Icon/marker.png";
const iconaAnnuncio = L.icon({
  iconUrl: markerIconUrl,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

onMounted(() => {

  inizializzaMappa();

  istanzaMappa.value.on("click", onMappaClick);

  istanzaMappa.value.on(L.Draw.Event.CREATED, function (event) {
    const layer = event.layer;

    if (event.layerType === "circle") {
      const latLng = layer.getLatLng();
      const radius = layer.getRadius();

      if (marcatore.value) {
        istanzaMappa.value.removeLayer(marcatore.value);
      }

      marcatore.value = layer;
      layer.addTo(istanzaMappa.value);

      props.filtro.latCentro = latLng.lat;
      props.filtro.lonCentro = latLng.lng;
      props.filtro.raggioKm = radius / 1000; // Converti il raggio in km
    }
  });
});

const onMappaClick = () => {
  mostraPopupAnnuncio.value = false;
};

const inizializzaMappa = () => {

  console.log("props: filtro nel Mappa.vue", props.filtro.latCentro);
  const initLat = props.filtro.latCentro || 40.8400998;
  const initLon = props.filtro.lonCentro || 14.2500966;
  const initRaggioKm = props.filtro.raggioKm || 0;
  console.log(
    "Inizializzo mappa con lat:",
    initLat,
    "lon:",
    initLon,
    "raggioKm:",
    initRaggioKm,
  );

  if (contenitoreMappa.value) {
    istanzaMappa.value = L.map(contenitoreMappa.value).setView(
      [initLat, initLon],
      17,
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(istanzaMappa.value);

    // Prepara il tool cerchio ma non lo mostra ancora
    drawCircle = new L.Draw.Circle(istanzaMappa.value, {
      shapeOptions: {
        color: "green",
        fillColor: "#aaddff",
        fillOpacity: 0.3,
      },
    });
  }
};

const attivaDisegnoCerchio = () => {
  // Rimuovi i vecchi marker
  markersAnnunci.value.forEach((marker) => {
    istanzaMappa.value.removeLayer(marker);
  });
  markersAnnunci.value = [];

  if (drawCircle) {
    drawCircle.enable();
  }
};

const rimuoviCerchio = () => {
  if (marcatore.value) {
    istanzaMappa.value.removeLayer(marcatore.value);
    marcatore.value = null;
  }

  filtroAnnunci.latCentro = null;
  filtroAnnunci.lonCentro = null;
  filtroAnnunci.raggioKm = null;
};

function ridisegnaCerchioDaFiltro() {
  const lat = props.filtro.latCentro;
  const lon = props.filtro.lonCentro;
  const raggioMetri = props.filtro.raggioKm * 1000;

  if (marcatore.value) {
    istanzaMappa.value.removeLayer(marcatore.value);
  }

  const cerchio = L.circle([lat, lon], {
    radius: raggioMetri,
    color: "blue",
    fillOpacity: 0.2,
  });

  cerchio.addTo(istanzaMappa.value);
  marcatore.value = cerchio;
}

const aggiornaMarker = () => {

  try {
    // Rimuovi i vecchi marker
    markersAnnunci.value.forEach((marker) => {
      istanzaMappa.value.removeLayer(marker);
    });
    markersAnnunci.value = [];

    // Aggiungi nuovi marker
    props.annunci.forEach((annuncio) => {
      const marker = L.marker(
        [
          annuncio.immobile.indirizzo.latitudine,
          annuncio.immobile.indirizzo.longitudine,
        ],
        { icon: iconaAnnuncio },
      )
        .addTo(istanzaMappa.value)
        .on("click", () => {
          annuncioSelezionato.value = annuncio;
          mostraPopupAnnuncio.value = true;
        });

      markersAnnunci.value.push(marker);
    });
  } catch (error) {
    console.error("Errore durante l'aggiornamento dei marker:", error);
  }
};

function formattaPrezzo(prezzoStringa) {
  // Converte in numero e formatta con separatore delle migliaia
  return Number(prezzoStringa).toLocaleString("it-IT");
}

const vaiAlDettaglioAnnuncio = (idAnnunciio) => {
  const url = window.location.origin + "/annuncio/" + idAnnunciio;
  window.open(url, "_blank");
};

watch([() => props.annunci], () => {
  mostraPopupAnnuncio.value = false;

  if (
    props.filtro.latCentro &&
    props.filtro.lonCentro &&
    props.filtro.raggioKm
  ) {
    ridisegnaCerchioDaFiltro();
  }

  aggiornaMarker();
});

watch(
  () => [props.filtro.latCentro, props.filtro.lonCentro, props.filtro.raggioKm],
  ([lat, lon, raggioKm]) => {
    if (istanzaMappa.value && lat && lon) {

      // Sposta la mappa sul nuovo centro
      istanzaMappa.value.setView([lat, lon], 13);

      ridisegnaCerchioDaFiltro();
    }
  }
);

onBeforeUnmount(() => {
  if (istanzaMappa.value) {
    istanzaMappa.value.off(); // rimuove tutti i listener
    istanzaMappa.value.remove(); // distrugge completamente la mappa
    istanzaMappa.value = null;
  }
  marcatore.value = null;
  drawCircle = null;
  markersAnnunci.value = [];
});
</script>

<template>
  <div class="relative h-full w-full">
    <div ref="contenitoreMappa" class="z-1 h-full w-full"></div>

    <div v-if="props.loading" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
      <ProgressSpinner style="width: 128px; height: 128px" strokeWidth="8" fill="transparent" animationDuration=".5s"
        aria-label="Custom ProgressSpinner" />
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

    <div v-if="mostraPopupAnnuncio"
      class="dettaglio-annuncio-pupup absolute right-4 top-4 z-10 flex flex-col w-70 h-90 md:w-90 md:h-90 rounded-md bg-white items-start justify-start">
      <div class="area-superiore p-2 w-full h-50 bg-gray-200 rounded-md">
        <Galleria :immagini="annuncioSelezionato.immobile.immagini" />
      </div>

      <div class="contratto mt-2 p-2 flex flex-row justify-between w-full">
        <Tag value="Primary">
          {{ annuncioSelezionato.contratto.tipoContratto }}
        </Tag>
      </div>

      <div class="titolo h-20 mt-1 p-2 items-start justify-start flex flex-col w-full">
        <span class="text-sm text-left text-green-600 hover:underline cursor-pointer"
          @click="vaiAlDettaglioAnnuncio(annuncioSelezionato.id)">
          {{ annuncioSelezionato.titolo }}
        </span>
      </div>

      <div class="prezzo mb-2 p-2">
        <span v-if="annuncioSelezionato.contratto.tipoContratto === 'AFFITTO'" class="font-bold text-3xl">{{
          formattaPrezzo(
            annuncioSelezionato.contratto.contrattoAffittoResponse
              .prezzoAffitto,
          )
        }}
          €/mese</span>
        <span v-else class="font-bold text-3xl">{{
          formattaPrezzo(
            annuncioSelezionato.contratto.contrattoVenditaResponse
              .prezzoVendita,
          )
        }}
          €</span>
      </div>
    </div>
  </div>
</template>
