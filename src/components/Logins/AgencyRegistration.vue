<template>
    <Fluid class="card p-4 ">
        <h2 class="text-center">Creazione Agenzia</h2>
        <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="handleRegister" class="flex flex-col gap-4">
            <Fieldset legend="Informazioni Agenzia" >
                <div class="gap-3">
                <InputText 
                fluid 
                v-model="initialValues.nomeAgenzia" 
                name="nomeAgenzia" 
                placeholder="Nome Agenzia" 
                :class="{'p-invalid': $form.nomeAgenzia?.invalid}" 
            />
            <Message v-if="$form.nomeAgenzia?.invalid" severity="error" size="small">{{ $form.nomeAgenzia.error?.message }}</Message>

            <InputText 
                fluid 
                v-model="initialValues.ragioneSociale" 
                name="ragioneSociale" 
                placeholder="Ragione Sociale" 
                :class="{'p-invalid': $form.ragioneSociale?.invalid}" 
            />
            <Message v-if="$form.ragioneSociale?.invalid" severity="error" size="small">{{ $form.ragioneSociale.error?.message }}</Message>

            <inputMask 
                mask="9999999 999 9"
                fluid 
                v-model="initialValues.partitaIva" 
                name="partitaIva" 
                placeholder="Partita Iva" 
                :class="{'p-invalid': $form.partitaIva?.invalid}" 
            />
            <Message v-if="$form.partitaIva?.invalid" severity="error" size="small">{{ $form.partitaIva.error?.message }}</Message>

            <InputText 
                fluid 
                v-model="initialValues.dominio" 
                name="dominio" 
                placeholder="Dominio della casella di posta" 
                :class="{'p-invalid': $form.dominio?.invalid}" 
            />
            <Message v-if="$form.dominio?.invalid" severity="error" size="small">{{ $form.dominio.error?.message }}</Message>
            
        </div>
            </Fieldset>

            <Fieldset legend="Informazioni Fondatore" class="gap-3">
        
                <InputText 
                fluid 
                v-model="initialValues.nomeFondatore" 
                name="nomeFondatore" 
                placeholder="Nome Fondatore" 
                :class="{'p-invalid': $form.nomeFondatore?.invalid}" 
            />
            <Message v-if="$form.nomeFondatore?.invalid" severity="error" size="small">{{ $form.nomeFondatore.error?.message }}</Message>
            
            <InputText 
                fluid 
                v-model="initialValues.cognomeFondatore" 
                name="cognomeFondatore" 
                placeholder="Cognome Fondatore" 
                :class="{'p-invalid': $form.cognomeFondatore?.invalid}" 
            />
            <Message v-if="$form.cognomeFondatore?.invalid" severity="error" size="small">{{ $form.cognomeFondatore.error?.message }}</Message>
            
            <InputText 
                fluid 
                v-model="initialValues.emailFondatore" 
                name="emailFondatore" 
                placeholder="Email Fondatore" 
                :class="{'p-invalid': $form.emailFondatore?.invalid}" 
            />
            <Message v-if="$form.emailFondatore?.invalid" severity="error" size="small">{{ $form.emailFondatore.error?.message }}</Message>
            
            </Fieldset>
            
            
            
            <Message v-if="registrationError" severity="error" size="small">{{ registrationError.response.data.toString().replace("{", "").replace("}", "") }}</Message>
            
            <Button type="submit" label="Registrati" :disabled="$form.$invalid" />

        </Form>
    </Fluid>
    
   
</template>

<script setup>
import { reactive, ref } from 'vue';
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import inputMask from 'primevue/inputmask';
import Fluid from 'primevue/fluid';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { useRouter } from 'vue-router';
import AgenziaImmobiliareService from '../../services/AgenziaImmobiliareService';
import Fieldset from 'primevue/fieldset';

const router = useRouter();

const initialValues = reactive({
    nomeAgenzia: '',
    ragioneSociale: '',
    partitaIva: '',
    dominio: '',
    nomeFondatore:'',
    cognomeFondatore:'',
    emailFondatore:'',
});

const AgenziaImmobiliareRequest = ref(initialValues);
const registrationError = ref('');

const resolver = ({ values }) => {
    const errors = {};

    if (!values.nomeAgenzia || values.nomeAgenzia.length < 3 || values.nomeAgenzia.length > 100) {
        errors.nomeAgenzia = [{ message: 'Il nome dell\'agenzia deve avere tra 3 e 100 caratteri.' }];
    }
    if (!values.nomeFondatore || values.nomeFondatore.length < 3 || values.nomeFondatore.length > 100) {
        errors.nomeFondatore = [{ message: 'Il nome del fondatore deve avere tra 3 e 100 caratteri.' }];
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(values.emailFondatore)) {
        errors.emailFondatore = [{ message: 'Email non valida.' }];
    }

    if (!values.cognomeFondatore || values.cognomeFondatore.length < 3 || values.cognomeFondatore.length > 100) {
        errors.cognomeFondatore = [{ message: 'Il cognome del fondatore deve avere tra 3 e 100 caratteri.' }];
    }

    // Controllo specifico per la ragione sociale
    if (!values.ragioneSociale || values.ragioneSociale.length < 3 || values.ragioneSociale.length > 80) {
        errors.ragioneSociale = [{ message: 'La ragione sociale deve avere tra 3 e 80 caratteri.' }];
    }

    // Controllo specifico per la partita IVA
    const partitaIvaPattern = /^\d{11}$/;
    if (!values.partitaIva || !partitaIvaPattern.test(values.partitaIva)) {
        errors.partitaIva = [{ message: 'La partita IVA deve essere un numero di esattamente 11 cifre.' }];
    }

    // Controllo specifico per il dominio
    const dominioPattern = /^[a-z0-9]+$/;
    if (!values.dominio || !dominioPattern.test(values.dominio) || values.dominio.includes(' ')) {
        errors.dominio = [{ message: 'Il dominio deve contenere solo lettere e numeri, senza caratteri speciali o spazi.' }];
    }

    return {
        values,
        errors
    };
};

const handleRegister = async () => {
    try {
        console.log(AgenziaImmobiliareRequest.value)
        const response = await AgenziaImmobiliareService.registerAgency(AgenziaImmobiliareRequest.value);
        console.log('Registrazione avvenuta con successo:', response);
        router.push({ name: 'confirmRegistration' });
    } catch (error) {
        registrationError.value = error;
        console.error('Registrazione fallita:', error);
    }
};


</script>

<style>
.card {
    max-width: 400px;
    margin: auto;
}
</style>
