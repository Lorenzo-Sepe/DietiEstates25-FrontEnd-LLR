<template>
  <div class="block gap-2 rounded-md p-4">
    <div>
      <Markdown
        class="w-full max-w-full overflow-x-auto"
        v-model="payload.contenuto"
        label="Contenuto"
      />
    </div>

    <!-- Sanitized HTML Preview -->
    <div
      class="ring-1 ring-primary-400 rounded-md p-2"
      v-html="DOMPurify.sanitize(test)"
    ></div>

    <Button label="Sending" @click="sendTest" icon="pi pi-send"></Button>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import { ref } from "vue";
import Markdown from "../components/MarkdownEditor.vue";
import DOMPurify from "dompurify";
import NotificheService from "../services/NotificheService";

const payload = {
  contenuto: `<img src="x" style="max-width: 100%; height: auto; object-fit: contain; display: block; margin: 0 auto;" class="tiptap-image"><p><span style="font-size: 17pt">òiwv35yoq </span></p><ol><li>kqw 4glq</li><li>lq wkkò</li></ol><p></p><ul><li>.q kwhrkqvg</li><li> khwvg</li></ul>`,
  oggetto: "Test",
  criteridiRicerca: {
    areaDiInteresse: "Napoli",
    intervallogiorniStoricoRicerca: 70,
  },
};

function sendTest() {
  payload.contenuto = DOMPurify.sanitize(payload.contenuto);

  NotificheService.creaNotifica(payload)
    .then((response) => {
      console.log("Response:", response);
      // Handle success
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle error
    });
  // Proceed to send it via API, etc.
}
</script>
