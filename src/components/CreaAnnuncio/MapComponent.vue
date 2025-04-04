<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps, defineEmits, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import datiComuni from '../../assets/comuniCap.json';
import { Indirizzo } from '../../dto/RequestAnnuncio';
// Lista dei comuni dal JSON
const listaComuni = ref(datiComuni);

const props = defineProps({
  activeStep: Number,
  via: String,
  numeroCivico: String,
  cap: String,
  citta: String,
  Indirizzo: Indirizzo,
});

const emit = defineEmits(['posizione-aggiornata']);

const contenitoreMappa = ref(null);
const istanzaMappa = ref(null);
const marcatore = ref(null);

// Inizializza la mappa
const inizializzaMappa = () => {
  istanzaMappa.value = L.map('mappa').setView([41.8719, 12.5674], 6);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
  }).addTo(istanzaMappa.value);
};

// Ottiene le coordinate con fallback se il civico non è trovato
const ottieniCoordinate = async () => {
  if (!props.via || !props.cap || !props.citta) {
    console.warn('Mancano alcuni dati essenziali dell’indirizzo.');
    return null;
  }


  const querySoloVia = new URLSearchParams({
    street: props.via,
    city: props.citta,
    postalcode: props.cap,
    country: 'Italia',
    format: 'json'
  }).toString();

  return await faiRichiestaGeocodifica(querySoloVia);
};

// Funzione per chiamare l'API di geocodifica
const faiRichiestaGeocodifica = async (query) => {
  try {
    const url= `https://nominatim.openstreetmap.org/search?${query}`;
    const risposta = await fetch(`https://nominatim.openstreetmap.org/search?${query}`);
    const dati = await risposta.json();
    console.log('url:', url);  
    console.log('Dati:', dati);
    if (dati.length > 0) {
      return {
        latitudine: parseFloat(dati[0].lat),
        longitudine: parseFloat(dati[0].lon),
      };
    }else
    {
      console.warn('Nessun risultato trovato per l’indirizzo:', query);
      console.log('Inserisco come cordinate quelle associta alla città:', props.via);
      const comune = listaComuni.value.find(comune => comune.denominazione_ita.toLowerCase() === props.citta.toLowerCase());
      if (comune) {
        return {
          latitudine: parseFloat(comune.latitudine),
          longitudine: parseFloat(comune.longitudine),
        };
      } else {
        console.warn('Comune non trovato nella lista dei comuni:', props.citta);
        console.log('inserisco cordinate di default');
        return {
          latitudine: 41.8719, // Latitudine di default (Italia centrale)
          longitudine: 12.5674, // Longitudine di default (Italia centrale)
        };
      }
    }
  } catch (errore) {
    console.error('Errore durante la richiesta al servizio di geocodifica:', errore);
  }

  return null;
};

// Aggiorna la mappa con il nuovo indirizzo
const aggiornaMappa = async () => {

  const coordinate = await ottieniCoordinate();
  if (coordinate) {
    const { latitudine, longitudine } = coordinate;
    
    istanzaMappa.value.setView([latitudine, longitudine], 17); 

    if (marcatore.value) {
      istanzaMappa.value.removeLayer(marcatore.value);
    }
    
    // Crea il marker trascinabile con popup informativo
    marcatore.value = L.marker([latitudine, longitudine], { draggable: true })
      .addTo(istanzaMappa.value)
      .bindPopup("📍 Trascinami per indicare con precisione la posizione!")
      .openPopup(); // Mostra subito il messaggio

    // Ascolta l'evento di trascinamento e aggiorna le coordinate
    marcatore.value.on('dragend', () => {
      const nuovaPosizione = marcatore.value.getLatLng();
      console.log('Nuova posizione:', nuovaPosizione);
      emit('posizione-aggiornata', { latitudine: nuovaPosizione.lat, longitudine: nuovaPosizione.lng });
      // Centra la mappa sulla nuova posizione del marker
      istanzaMappa.value.setView([nuovaPosizione.lat, nuovaPosizione.lng], 17);

       // Usa un piccolo ritardo per garantire che la mappa abbia il tempo di aggiornarsi
  setTimeout(() => {
    istanzaMappa.value.panTo(nuovaPosizione, { animate: true });
  }, 100);  
      // Dopo il trascinamento, mostra un popup di conferma
      marcatore.value
        .bindPopup("✅ Posizione aggiornata! Se necessario, trascina ancora.")
        .openPopup();
    });
  } else {
    console.warn('Indirizzo non trovato.');
  }

};
watch(() => props.activeStep, (nuovoStep) => {
  if (nuovoStep === 4) {
    forzaRidisegnoMappa();
  }
});
// Quando cambia l'indirizzo, aggiorniamo la mappa
watch([() => props.via, () => props.numeroCivico, () => props.cap, () => props.citta], () => {
  aggiornaMappa();
});

onMounted(() => {
  inizializzaMappa();
  if(props.citta) {
    aggiornaMappa();
  } else {
    console.warn('Indirizzo non valido, non posso inizializzare la mappa.');
  }
});

onBeforeUnmount(() => {
  if (istanzaMappa.value) {
    istanzaMappa.value.remove();
  }
});


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
</script>

<template>
  <div id="mappa" ref="contenitoreMappa" style="height: 400px; width: 100%;"></div>
</template>
