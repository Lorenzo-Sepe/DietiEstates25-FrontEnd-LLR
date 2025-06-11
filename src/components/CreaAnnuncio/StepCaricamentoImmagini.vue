<template>
  <Message severity="error" variant="filled" class="mb-4 text-left">
    <p>Verifica e correggi i seguenti errori:</p>
    <ul class="list-disc pl-5">
      <li v-if="errori.immagineiVuote.invalid">
        {{ errori.immagineiVuote.messaggio }}
      </li>
      <li v-if="errori.dimensioneTotale.invalid">
        {{ errori.dimensioneTotale.messaggio }}
      </li>
      <li v-if="true || errori.descrizioneLunga.invalid">
        {{ errori.descrizioneLunga.messaggio }}
      </li>
    </ul>
  </Message>
  <div class="contenitore-card">
    <!-- Barra superiore: pulsanti e messaggio info -->
    <div class="barra-superiore">
      <input
        type="file"
        multiple
        accept="image/*"
        @change="onSelectedFiles"
        hidden
        ref="inputFile"
      />
      <Button
        @click="apriSelettore"
        icon="pi pi-image"
        label="Aggiungi immagini"
        outlined
        class="pulsante"
      />
      <Button
        @click="pulisciTutto"
        icon="pi pi-trash"
        label="Pulisci tutto"
        severity="danger"
        outlined
        class="pulsante"
        :disabled="!annuncio.immobile.immagini.length"
      />
      <Message
        v-if="dimensioneTotaleMB > 1"
        severity="error"
        class="spazio-messaggio"
      >
        Utilizzo spazio immagini: {{ dimensioneTotaleMB }} MB / 10 MB <br />
        Hai superato il limite massimo di 1 MB. Elimina alcune immagini per
        continuare.
      </Message>
      <Message v-else severity="info" class="spazio-messaggio">
        Utilizzo spazio immagini: {{ dimensioneTotaleMB }} MB / 10 MB
      </Message>

      <Message v-if="tentativoInvio" severity="error" class="spazio-messaggio"
        >Controlla le immagini caricate</Message
      >
    </div>

    <!-- Area immagini caricate -->
    <div v-if="annuncio.immobile.immagini.length" class="griglia-immagini">
      <div
        v-for="(img, indice) in annuncio.immobile.immagini"
        :key="indice"
        class="carta-immagine"
      >
        <div class="contenitore-anteprima">
          <Skeleton v-if="img.loading" width="100%" height="200px" />
          <img v-else :src="img.urlImmagineEsistente" class="immagine" />
          <Button
            icon="pi pi-times"
            severity="danger"
            class="bottone-rimuovi"
            @click="rimuoviFile(indice)"
            rounded
            text
          />
        </div>
        <div class="area-descrizione">
          <InputText
            v-model="img.descrizione"
            placeholder="Inserisci una descrizione"
            class="campo-descrizione"
            :invalid="errori.descrizione[indice]?.invalid"
            @input="verificaDati(indice)"
            @blur="verificaDati(indice)"
          />
          <Message
            v-if="errori.descrizione[indice]?.invalid"
            severity="error"
            variant="simple"
            size="small"
          >
            {{ errori.descrizione[indice].messaggio }}
          </Message>
        </div>
        <div class="info-file">
          <span>Dimensione: {{ formattaDimensione(img.file?.size || 0) }}</span>
        </div>
      </div>
    </div>

    <!-- Area vuota per trascinamento -->
    <div
      v-else
      class="area-trascina"
      @dragover.prevent="trascinaInCorso = true"
      @dragleave.prevent="trascinaInCorso = false"
      @drop.prevent="gestisciTrascinamento"
      :class="{ evidenzia: trascinaInCorso }"
    >
      <i class="pi pi-image icona-trascina" />
      <p class="testo-trascina">Clicca o trascina immagini qui</p>
    </div>

    <!-- Pulsanti navigazione -->
    <StickyButtons>
      <div class="flex pt-6 justify-between">
        <Button
          label="Indietro"
          severity="secondary"
          icon="pi pi-arrow-left"
          @click="$emit('indietro')"
        />
        <Button
          label="Avanti"
          icon="pi pi-arrow-right"
          iconPos="right"
          @click="validaEAvanza"
        />
      </div>
    </StickyButtons>
  </div>
</template>

<script setup>
import {
  ref,
  defineProps,
  computed,
  defineEmits,
  onMounted,
  reactive,
} from "vue";
import { Button, InputText, Message, Skeleton } from "primevue";
import {
  AnnuncioImmobiliareRequest,
  Immagine,
} from "../../dto/RequestAnnuncio";
import StickyButtons from "./StickyButtons.vue";
import { scrollToFirstError } from "../../utils/scrollToError";

const errori = reactive({
  immagineiVuote: {
    invalid: false,
    messaggio: "Devi caricare almeno un'immagine",
  },
  dimensioneTotale: {
    invalid: false,
    messaggio: "Le immagini caricate superano i 50 MB totali",
  },
  descrizioneLunga: {
    invalid: false,
    messaggio: "Ogni descrizione deve essere di massimo 20 caratteri",
  },
  descrizione: [], // Inizializza come array vuoto
});
const verificaDati = (indice) => {
  errori.descrizione[indice] = { invalid: false, messaggio: "" };
  if (props.annuncio.immobile.immagini[indice].descrizione.length > 20) {
    errori.descrizione[indice] = {
      invalid: true,
      messaggio: "La descrizione deve essere di massimo 20 caratteri",
    };
  }
};
const dimensioneTotaleMB = computed(() => {
  const totale = props.annuncio.immobile.immagini.reduce(
    (acc, img) => acc + (img.file?.size || 0),
    0,
  );
  return (totale / (1024 * 1024)).toFixed(2);
});

const emit = defineEmits(["indietro", "avanti"]);
const props = defineProps({
  annuncio: AnnuncioImmobiliareRequest,
  tentativoInvio: Boolean,
});

const validaCampi = () => {
  errori.immagineiVuote.invalid =
    props.annuncio.immobile.immagini.length === 0;
  errori.dimensioneTotale.invalid = dimensioneTotaleMB.value > 10; // Limite di 10 MB
  errori.descrizioneLunga.invalid = props.annuncio.immobile.immagini.some(
    (img) => img.descrizione.length > 20,
  );

  // Verifica descrizioni per ogni immagine
  props.annuncio.immobile.immagini.forEach((img, index) => {
    verificaDati(index);
  });
};


const validaEAvanza = () => {
  validaCampi();
  if (!Object.values(errori).some((e) => e.invalid)) {
    emit("avanti");
    console.log("validaEAvanza")
  } else {
    scrollToFirstError(errori);
  }
};

const inputFile = ref(null);

const apriSelettore = () => {
  inputFile.value.click();
};
const trascinaInCorso = ref(false);

const gestisciTrascinamento = (evento) => {
  trascinaInCorso.value = false;
  const fileTrascinati = Array.from(evento.dataTransfer.files);

  fileTrascinati.forEach((file) => {
    if (!file.type.startsWith("image/")) return; // controllo formato immagine

    const lettore = new FileReader();
    lettore.onload = (e) => {
      const nuovaImmagine = new Immagine();
      nuovaImmagine.file = file;
      nuovaImmagine.urlImmagineEsistente = e.target.result;
      nuovaImmagine.descrizione = "";
      nuovaImmagine.loading = false;
      props.annuncio.immobile.immagini.push(nuovaImmagine);
    };
    lettore.readAsDataURL(file);
  });
};
const onSelectedFiles = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const immagine = new Immagine();
      immagine.file = file;
      immagine.urlImmagineEsistente = e.target.result;
      immagine.descrizione = ``;
      immagine.loading = false;
      props.annuncio.immobile.immagini.push(immagine);
      errori.descrizione.push({ invalid: false, messaggio: "" });
      console.log("Immagini:", props.annuncio.immobile.immagini);
    };
    reader.readAsDataURL(file);
  });
  event.target.value = "";
};

const rimuoviFile = (index) => {
  props.annuncio.immobile.immagini.splice(index, 1);
};

const pulisciTutto = () => {
  props.annuncio.immobile.immagini = [];
};

const formattaDimensione = (byte) => {
  if (!byte) return "0 B";
  const k = 1024;
  const unita = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(byte) / Math.log(k));
  return parseFloat((byte / Math.pow(k, i)).toFixed(1)) + " " + unita[i];
};

// Funzione per creare un oggetto File da un URL base64
function creaFileDaUrl(base64, nomeFile) {
  return new Promise((resolve, reject) => {
    try {
      // Estrazione della parte MIME e dei dati base64
      const [header, base64Data] = base64.split(",");

      // Estrazione del tipo MIME dall'header
      const tipo = header.split(":")[1].split(";")[0];

      // Converte la parte base64 in un array di byte
      const byteArray = new Uint8Array(
        atob(base64Data)
          .split("")
          .map((char) => char.charCodeAt(0)),
      );

      // Crea un oggetto Blob con il tipo MIME estratto
      const blob = new Blob([byteArray], { type: tipo });

      // Crea un oggetto File dal Blob
      const file = new File([blob], nomeFile, { type: tipo });

      // Risolve la Promise con il file creato
      resolve(file);
    } catch (error) {
      // Rifiuta la Promise in caso di errore
      reject(error);
    }
  });
}

// Funzione per creare un oggetto File da un URL remoto
async function creaFileDaUrlRemoto(url, nomeFile) {
  const response = await fetch(url);
  const blob = await response.blob();

  // Restituisce l'oggetto File
  return new File([blob], nomeFile, { type: blob.type });
}

const convertiImmaginiEsistenti = async () => {
  console.log("Inizio conversione immagini esistenti");
  for (const img of props.annuncio.immobile.immagini) {
    console.log("Immagine:", img);

    // Controlla se il file esiste già
    if (
      !img.file ||
      (typeof img.file === "object" && Object.keys(img.file).length === 0)
    ) {
      img.loading = true; // Imposta il flag di caricamento

      // Controlla se l'URL è in formato base64
      if (img.urlImmagineEsistente.startsWith("data:")) {
        // Se è un URL base64, crea il file da URL base64
        creaFileDaUrl(img.urlImmagineEsistente, "immagine.jpg")
          .then((file) => {
            img.file = file; // Assegna il file creato all'immagine
            img.loading = false; // Rimuovi il flag di caricamento
          })
          .catch((error) => {
            console.error(
              "Errore nella conversione dell'immagine da base64:",
              error,
            );
            img.loading = false; // Rimuovi il flag di caricamento in caso di errore
          });
      } else {
        // Se non è un URL base64, prova a scaricare l'immagine da un URL remoto
        creaFileDaUrlRemoto(img.urlImmagineEsistente, "immagine.jpg")
          .then((file) => {
            img.file = file; // Assegna il file creato all'immagine
            img.loading = false; // Rimuovi il flag di caricamento
          })
          .catch((error) => {
            console.error(
              "Errore nella conversione dell'immagine da URL remoto:",
              error,
            );
            img.loading = false; // Rimuovi il flag di caricamento in caso di errore
          });
      }
    } else {
      img.loading = false; // Rimuovi il flag di caricamento se il file esiste già
    }
  }
};

// Chiamata alla funzione di conversione quando il componente è montato
onMounted(() => {
  //per ogni elmento in immagini aggiungi il relativo campo errore
  props.annuncio.immobile.immagini.forEach(() => {
    errori.descrizione.push({ invalid: false, messaggio: "" });
  });
  convertiImmaginiEsistenti();
});
</script>

<style scoped>
.contenitore-card {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.barra-superiore {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.pulsante {
  min-width: 150px;
}

.spazio-messaggio {
  margin-top: 10px;
  flex-basis: 100%;
}

.griglia-immagini {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.carta-immagine {
  width: 220px;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contenitore-anteprima {
  position: relative;
}

.immagine {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.bottone-rimuovi {
  position: absolute !important;
  top: 6px;
  right: 6px;
  background-color: rgba(220, 53, 69, 0.85);
  color: white;
}

.area-descrizione {
  display: flex;
  flex-direction: column;
}

.campo-descrizione {
  flex: 1;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.9rem;
}

.info-file {
  font-size: 0.75rem;
  color: #666;
  text-align: center;
}

.area-trascina {
  border: 2px dashed #ccc;
  background-color: #f9f9f9;
  text-align: center;
  padding: 30px;
  border-radius: 12px;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}

.area-trascina.evidenzia {
  border-color: #3f51b5;
  background-color: #e8eaf6;
}

.icona-trascina {
  font-size: 3rem;
  color: #bbb;
}

.testo-trascina {
  font-size: 1rem;
  color: #666;
  margin-top: 10px;
}

.barra-navigazione {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}
</style>
