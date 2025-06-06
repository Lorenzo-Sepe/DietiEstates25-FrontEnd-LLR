<template>
  <Form
    v-slot="$form"
    :resolver="risolutore"
    :validate-on-blur
    @submit="onInvio"
    class="flex flex-col gap-4"
  >
    <FormField
      v-if="cambioPassword"
      v-slot="$campo"
      name="passwordAttuale"
      initialValue=""
      class="flex flex-col gap-1"
    >
      <Password
        fluid
        :feedback="false"
        v-model="passwordAttuale"
        placeholder="Inserisci la tua password attuale"
      />
      <Message
        v-if="$campo?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $campo.error?.message }}
      </Message>
    </FormField>

    <FormField
      v-slot="$campo"
      name="password"
      initialValue=""
      class="flex flex-col gap-1"
    >
      <Password
        fluid
        :mediumRegex="regexMedia"
        :strongRegex="regexForte"
        v-model="password"
        placeholder="Inserisci la nuova password"
      >
        <template #footer>
          <Divider />
          <ul class="pl-2 my-0 leading-normal">
            <li
              v-for="(req, index) in statoRequisiti"
              :key="index"
              :class="{
                'text-green-600': req.soddisfatto,
                'text-red-600': !req.soddisfatto,
                'flex items-center gap-1': true,
              }"
            >
              <span v-if="req.soddisfatto">✔️</span>
              <span v-else>❌</span>
              {{ req.testo }}
            </li>
          </ul>
        </template>
      </Password>
      <Message
        v-if="$campo?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $campo.error?.message }}
      </Message>
    </FormField>

    <FormField
      v-slot="$campo"
      name="confermaPassword"
      initialValue=""
      class="flex flex-col gap-1"
    >
      <Password
        fluid
        v-model="confermaPassword"
        :feedback="false"
        placeholder="Conferma la nuova password"
      />
      <Message
        v-if="$campo?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $campo.error?.message }}
      </Message>
    </FormField>

    <Button label="Conferma" type="submit" :disabled="$form.$invalid" />
  </Form>
</template>

<script setup>
import { ref, computed, defineProps } from "vue";
import { Form, FormField } from "@primevue/forms";
import Password from "primevue/password";
import Message from "primevue/message";
import Button from "primevue/button";
import Divider from "primevue/divider";

const props = defineProps({
  cambioPassword: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit"]);

const passwordAttuale = ref("");
const password = ref("");
const confermaPassword = ref("");

// Regex per requisiti singoli
const regexRequisiti = {
  minuscola: /[a-z]/,
  maiuscola: /[A-Z]/,
  numero: /\d/,
  simbolo: /[@#$£%^&+=!?\\-_]/,
  lunghezzaMin: /^.{8,}$/, // almeno 8 caratteri
  lunghezzaMax: /^.{0,16}$/, // max 16 caratteri (puoi regolare se vuoi)
};

const requisitiPassword = [
  { testo: "Almeno una lettera minuscola", regex: regexRequisiti.minuscola },
  { testo: "Almeno una lettera maiuscola", regex: regexRequisiti.maiuscola },
  { testo: "Almeno un numero", regex: regexRequisiti.numero },
  {
    testo: "Almeno un simbolo (@#$£%^&+=!?\\-_)",
    regex: regexRequisiti.simbolo,
  },
  { testo: "Minimo 8 caratteri", regex: regexRequisiti.lunghezzaMin },
  { testo: "Massimo 16 caratteri", regex: regexRequisiti.lunghezzaMax },
];

// Computed che ritorna array con ogni requisito e se è soddisfatto
const statoRequisiti = computed(() => {
  return requisitiPassword.map((req) => ({
    testo: req.testo,
    soddisfatto: req.regex.test(password.value),
  }));
});

const risolutore = ({ values }) => {
  const errori = {};
  const regexPassword =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$£%^&+=!?\-_]).{8,16}$/;

  if (props.cambioPassword && !values.passwordAttuale) {
    errori.passwordAttuale = [{ message: "Inserisci la tua vecchia password" }];
  }

  if (!regexPassword.test(values.password)) {
    errori.password = [
      {
        message: "La password non è abbastanza forte.",
      },
    ];
  }

  if (values.password !== values.confermaPassword) {
    errori.confermaPassword = [{ message: "Le password non corrispondono." }];
  }

  return { errors: errori };
};

const onInvio = () => {
  const risultato = risolutore({
    values: {
      passwordAttuale: passwordAttuale.value,
      password: password.value,
      confermaPassword: confermaPassword.value,
    },
  });

  if (Object.keys(risultato.errors).length > 0) {
    console.warn(
      "Warning Tentativo di invio\n non puoi inviare fino a quando non inserisci una password valida:",
      risultato.errors,
    );
    return;
  }
  if (props.cambioPassword) {
    emit("submit", {
      passwordAttuale: passwordAttuale.value,
      password: password.value,
      confermaPassword: confermaPassword.value,
    });
  } else {
    emit("submit", {
      password: password.value,
      confermaPassword: confermaPassword.value,
    });
  }
};
</script>

<style scoped>
/* puoi aggiungere stili per icone o lista se vuoi */
</style>
