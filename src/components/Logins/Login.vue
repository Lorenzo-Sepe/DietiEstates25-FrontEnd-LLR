<template>
  <div class="flex flex-col items-center justify-between p-2 bg-primary-100 rounded">
    <!-- Se login completato mostra il messaggio di benvenuto -->
    <div v-if="loginSuccess" class="text-center p-5">
      <h2 class="text-xl font-semibold text-green-600 mb-2">
        Benvenuto, {{ userName }}!
      </h2>
      <p class="text-gray-700">Accesso effettuato con successo.</p>
      <p class="text-gray-500 text-sm mt-1">Verrai reindirizzato tra pochi secondi...</p>
    </div>

    <!-- Altrimenti mostra il form di login -->
    <Form
      v-else
      v-slot="$form"
      :initialValues
      :resolver
      @submit="onFormSubmit"
      class="rounded flex flex-col gap-4 justify-center items-center p-5 fluid w-full sm:w-1/2"
    >
      <div class="flex flex-col gap-1 fluid w-full">
        <InputText
          fluid
          v-model="signInRequest.usernameOrEmail"
          name="email"
          type="text"
          placeholder="Email"
        />
        <Message
          v-if="$form.email?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.email.error?.message }}
        </Message>

        <Password
          fluid
          :feedback="false"
          v-model="signInRequest.password"
          name="password"
          placeholder="Password"
          :class="{ 'p-invalid': errorMessage }"
          toggleMask
        />
        <Message
          v-if="$form.password?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.password.error?.message }}</Message
        >
      </div>
      <Button
        :loading="loading"
        type="submit"
        raised
        label="Accedi"
      />
    </Form>

    <div v-if="errorMessage" class="text-red-500 text-sm mt-2">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";

import Message from "primevue/message";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import { Form } from "@primevue/forms";
import { useUIStore } from "../../stores/UiStore";

import AuthService from "../../services/AuthService";

const emit = defineEmits(["close"]);
const router = useRouter();

const loading = ref(false);
const errorMessage = ref("");
const loginSuccess = ref(false);
const userName = ref("");

const initialValues = reactive({
  email: "",
  password: "",
});

const signInRequest = ref({
  usernameOrEmail: "",
  password: "",
});

const validaEmail = (email) => {
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regexEmail.test(email);
};

const resolver = ({ values }) => {
  const errors = {};

  if (!values.email) {
    errors.email = [{ message: "Inserire Email" }];
  } else if (!validaEmail(values.email)) {
    errors.email = [{ message: "Inserire un email valida" }];
  }

  if (!values.password) {
    errors.password = [{ message: "Inserire Password." }];
  }

  return { values, errors };
};

const onFormSubmit = async ({ valid }) => {
  loading.value = true;
  if (!valid) {
    loading.value = false;
    return;
  }
  errorMessage.value = "";

  try {
    const response = await AuthService.login({
      Email: signInRequest.value.usernameOrEmail,
      password: signInRequest.value.password,
    });
    loading.value = false;

    // Mostra messaggio di benvenuto
    loginSuccess.value = true;
    userName.value = response.nome || "Utente";

    const uiStore = useUIStore();

    // Ritarda il reindirizzamento di 2.5 secondi
    setTimeout(() => {
      if (response.ruolo !== "MEMBER") {
        //CONTROLO
        if (uiStore.loginRole === "employee" && uiStore.toPath) {
          
          router.push(uiStore.toPath);

        } else {

          router.push({ path: "/PortaleAgenzia/pannelloStaff" });
        }

      } else {

        router.push({ path: "/" });
      }

      emit("close");
    }, 2500);

  } catch (error) {

    console.error(error);
    loading.value = false;
    
    if (error.response) {
      errorMessage.value = error.response.data;
    } else {
      errorMessage.value = "Errore di rete o di configurazione: " + error.message;
    }
  }
};
</script>
