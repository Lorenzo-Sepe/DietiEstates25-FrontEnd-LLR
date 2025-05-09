// utils/scrollToError.js
export const scrollToFirstError = (errori) => {
  for (const fieldId in errori) {
    if (errori[fieldId]?.invalid) {
      document
        .getElementById(fieldId)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      break; // Esci dal ciclo dopo aver trovato il primo errore
    }
  }
};
