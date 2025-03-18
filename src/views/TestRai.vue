<script setup>
import { reactive } from "vue";
import { AnnuncioImmobiliareRequest, Immagine} from "../dto/RequestAnnuncio";
import { CreaAnnuncio } from "../services/CreazioneModificaAnnunciService";
const annuncio = reactive(new AnnuncioImmobiliareRequest());

const inviaAnnuncio = () => {
  console.log("Dati dell'annuncio input form:", annuncio);
  CreaAnnuncio(annuncio)

};
const handleImageUpload = (e) => {

  const files = e.target.files; // Ottieni tutti i file caricati
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const image = new Immagine(); // Crea una nuova istanza di Immagine
    image.file = file; // Assegna il file originale, non il data URL
    image.descrizione = `Immagine ${i + 1}`; // Assegna una descrizione unica
    annuncio.immobile.immagini.push(image); // Aggiungi l'immagine all'array
  }
};
</script>

<template>
  <form @submit.prevent="inviaAnnuncio">
    <h2>Test Upload Annuncio</h2>
    
    <label>Titolo</label>
    <input v-model="annuncio.titolo" type="text" />
    
    <label>Descrizione</label>
    <textarea v-model="annuncio.descrizione"></textarea>
    
    <h3>Dettagli Immobile</h3>
    <label>Tipologia Immobile</label>
    <input v-model="annuncio.immobile.tipologiaImmobile" type="text" />
    
    <label>Metri Quadri</label>
    <input v-model.number="annuncio.immobile.metriQuadri" type="number" />
    
    <label>Numero di Stanze</label>
    <input v-model.number="annuncio.immobile.numeroStanze" type="number" />
    
    <label>Classe Energetica</label>
    <input v-model="annuncio.immobile.classeEnergetica" type="text" />
    
    <h3>Indirizzo</h3>
    <label>Via</label>
    <input v-model="annuncio.immobile.indirizzo.via" type="text" />
    
    <label>Città</label>
    <input v-model="annuncio.immobile.indirizzo.citta" type="text" />
    
    <h3>Contratto</h3>
    <label>Tipo di Contratto</label>
    <input v-model="annuncio.contratto.tipoDiContratto" type="text" />
    
    <label>Prezzo Vendita</label>
    <input v-model.number="annuncio.contratto.datiVenditaRequest.prezzo" type="number" />
    
    <label>Prezzo Affitto</label>
    <input v-model.number="annuncio.contratto.datiAffittoRequest.prezzo" type="number" />

    <h3>Immagini multiple file</h3>
    <input type="file" @change="handleImageUpload" accept="image/*" multiple />
    <button type="submit">Invia Annuncio</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
label {
  font-weight: bold;
}
input, textarea {
  padding: 5px;
  font-size: 16px;
    border: 1px solid black;
}
button {
  padding: 10px;
  background: blue;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
