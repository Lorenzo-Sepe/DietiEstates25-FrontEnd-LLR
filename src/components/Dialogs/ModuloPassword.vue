<template>
  <Form
    v-slot="$form"
    :resolver="risolutore"
    :validate-on-blur
    @submit="onInvio"
    class="flex flex-col gap-4"
  >
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
        placeholder="Inserisci la tua password"
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
      name="confermaPassword"
      initialValue=""
      class="flex flex-col gap-1"
    >
      <Password
        fluid
        v-model="confermaPassword"
        :feedback="false"
        placeholder="Conferma la tua password"
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
import { ref } from "vue";
import { Form, FormField } from "@primevue/forms";
import Password from "primevue/password";
import Message from "primevue/message";
import Button from "primevue/button";

const emit = defineEmits(["submit"]);
const password = ref("");
const confermaPassword = ref("");

const regexMedia = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!?\-_]).{8,11}$/;
const regexForte =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$£%^&+=!?\-_]).{12,16}$/;

const risolutore = ({ values }) => {
  const errori = {};
  const regexPassword =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$£%^&+=!?\-_]).{8,16}$/;

  if (!regexPassword.test(values.password)) {
    errori.password = [
      {
        message:
          "La password deve avere tra 8 e 16 caratteri e includere almeno un numero, una lettera maiuscola, una lettera minuscola e un simbolo.",
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
      password: password.value,
      confermaPassword: confermaPassword.value,
    },
  });

  if (Object.keys(risultato.errors).length > 0) {
    console.warn(
      "Warning Tentativo di invio\n non puoi inviare fino a quando non inserisci una passoword valida:",
      risultato.errors,
    );
    return;
  }
  emit("submit", {
    password: password.value,
    confermaPassword: confermaPassword.value,
  });
};
</script>
