<template>
<div v-if="isRegistrationSuccess" fluid class="card p-4 fluid">
    <Message severity="success" size="small">
      {{ message }}
    </Message>
    <Button label="Chiudi" @click="emit('close')" />
</div>
<div v-else fluid class="card p-4 fluid">
    <Form
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      @submit="handleRegister"
      class="flex flex-col gap-4"
    >
      <InputText
        fluid
        v-model="initialValues.nome"
        name="nome"
        placeholder="Nome Nuovo Dipendente"
        :class="{ 'p-invalid': $form.nome?.invalid }"
      />
      <Message v-if="$form.nome?.invalid" severity="error" size="small">{{
        $form.nome.error?.message
      }}</Message>

      <InputText
        fluid
        v-model="initialValues.cognome"
        name="cognome"
        placeholder="Cognome Nuovo Dipendente"
        :class="{ 'p-invalid': $form.cognome?.invalid }"
      />
      <Message v-if="$form.cognome?.invalid" severity="error" size="small">{{
        $form.cognome.error?.message
      }}</Message>

      <Select
        fluid
        name="role"
        :options="roles"
        optionLabel="name"
        optionValue="code"
        placeholder="Seleziona un Ruolo"
        :class="{ 'p-invalid': $form.role?.invalid }"
        v-model="initialValues.ruolo"
      />
      <Message v-if="$form.role?.invalid" severity="error" size="small">{{
        $form.role.error?.message
      }}</Message>

      <Message v-if="registrationError" severity="error" size="small">
        {{
          registrationError?.response?.data?.message ||
          "Errore durante la registrazione."
        }}
      </Message>

      <Button
        type="submit"
        label="Registra Nuovo Dipendente"
        :disabled="$form.$invalid"
      />
    </Form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { Form } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Button from "primevue/button";
import Message from "primevue/message";
import AgenziaImmobiliareService from "../../services/AgenziaImmobiliareService";

const emit = defineEmits(["close"]);

const initialValues = reactive({
  nome: "",
  cognome: "",
  ruolo: "",
});

const isRegistrationSuccess = ref(false);
const message = ref("");
const NewAgentRequest = ref(initialValues);

const roles = ref([
  { name: "Agente", code: "AGENT" },
  { name: "Manager", code: "MANAGER" },
]);

const registrationError = ref("");

const resolver = ({ values }) => {
  const errors = {};

  if (!values.nome || values.nome.length < 3 || values.nome.length > 20) {
    errors.nome = [{ message: "Nome deve avere tra 3 e 20 caratteri." }];
  }

  if (
    !values.cognome ||
    values.cognome.length < 3 ||
    values.cognome.length > 20
  ) {
    errors.cognome = [{ message: "Cognome deve avere tra 3 e 20 caratteri." }];
  }

  if (!values.role || values.role.length < 3 || values.role.length > 20) {
    errors.role = [{ message: "Ruolo e' obligatorio." }];
  }

  return {
    values,
    errors,
  };
};

const handleRegister = async () => {
  try {
    const response = await AgenziaImmobiliareService.addEmployee(
      NewAgentRequest.value,
    );
    console.log("Registrazione avvenuta con successo:", response);
    message.value = "Registrazione avvenuta con successo!";
    isRegistrationSuccess.value = true;
    // emit("close"); // Se vuoi chiudere il dialog subito dopo, decommenta questa riga
  } catch (error) {
    registrationError.value = error;
    console.error("Registrazione fallita:", error);
  }
};
</script>

<style>
.card {
  max-width: 400px;
  margin: auto;
}
</style>
