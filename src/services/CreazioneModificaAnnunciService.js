import { ApiAgent } from "../api/axiosConfig";
import { AnnuncioImmobiliareRequest } from "../dto/RequestAnnuncio";

export function CreaAnnuncio(oggettoAnnuncio) {
  const annuncio = new AnnuncioImmobiliareRequest(oggettoAnnuncio);

  // Clona l'annuncio per rimuovere i file prima di serializzarlo in JSON
  const annuncioClone = JSON.parse(JSON.stringify(annuncio));

  // Rimuovi i file dalle immagini nel clone
  if (
    annuncioClone?.immobile?.immagini &&
    Array.isArray(annuncioClone.immobile.immagini)
  ) {
    annuncioClone.immobile.immagini.forEach((img) => {
      delete img.file;
    });
  }

  // Crea il FormData
  const formData = new FormData();

  // Aggiungi il JSON nel campo "dati"
  const datiBlob = new Blob([JSON.stringify(annuncioClone)], {
    type: "application/json",
  });
  formData.append("dati", datiBlob);

  // Aggiungi i file
  if (
    annuncio?.immobile?.immagini &&
    Array.isArray(annuncio.immobile.immagini)
  ) {
    annuncio.immobile.immagini.forEach((img) => {
      if (img.file) {
        formData.append("immagini", img.file);
      }else{
        console.warn("Immagine senza file:", img);
      }
    });
  }

  return ApiAgent()
    .post("annuncioImmobiliare", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      return response.data;
    });
}
