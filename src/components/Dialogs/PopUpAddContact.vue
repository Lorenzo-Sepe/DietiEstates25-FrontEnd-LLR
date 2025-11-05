<template>

    <ConfirmDialog></ConfirmDialog>

    <Dialog v-model:visible="loadingDialog" modal :style="{ width: 'auto' }" :closable="false"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">

        <div class="card flex justify-center">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
                animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        </div>

    </Dialog>

    <Dialog v-model:visible="feedbackPositivoDialog" modal :style="{ width: 'auto' }" :closable="false"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">

        <div class="flex flex-col gap-2 justify-center">
            <span class="text-base font-semibold text-green-600">Operazione completata con successo</span>
            <Button class="!w-auto !px-6 !py-1 !text-sm !rounded-lg !bg-green-600 hover:!bg-green-700 !text-white shadow-sm" @click="feedbackPositivoDialog = false" label="OK" />
        </div>

    </Dialog>

    <Dialog v-model:visible="feedbackNegativoDialog" modal :style="{ width: 'auto' }" :closable="false"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">

        <div class="card flex justify-center">
            <span>Errore, operazione non riuscita</span>
            <Button @click="feedbackNegativoDialog.value = false">OK</Button>
        </div>

    </Dialog>

    <div class="flex flex-col gap-4">

        <div class="riga-input flex flex-row gap-2">

            <div class="tipo-contatto">
                <label for="TipoContatto" class="font-bold block mb-2">
                    Tipo contatto
                </label>
                <Select v-model="selectedTipoContatto" :invalid="tipoContattoNonValido" :options="tipiContatto"
                    optionLabel="name" placeholder="Seleziona tipo contatto" class="w-full md:w-56"
                    @change="resetErrori" />
                <Message severity="error" variant="simple" size="small">{{
                    errori.tipoContatto.messaggio
                    }}</Message>
            </div>

            <div class="valore-contatto">
                <label for="Contatto" class="font-bold block mb-2">
                    Info contatto
                </label>
                <div class="flex flex-row gap-2">
                    <InputText id="contatto" v-model="contatto" :invalid="contattoNonValido" @input="resetErrori" />
                    <Button icon="pi pi-plus" severity="success" @click="addContact" />
                </div>

                <Message severity="error" variant="simple" size="small">{{
                    errori.contatto.messaggio
                    }}</Message>
            </div>

        </div>

        <div>
            <p class="mb-1 font-bold">Contatti esistenti:</p>
            <div class="contatti-esistenti flex border p-2">

                <DataTable :value="contacts" tableStyle="min-width: 30rem">
                    <Column field="tipo" header="Tipo Contatto"></Column>
                    <Column field="valore" header="Contatto"></Column>
                </DataTable>

            </div>
        </div>


    </div>


</template>

<script setup>

import { ref, reactive, onMounted, defineProps } from "vue";

import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Message from "primevue/message";
import Button from "primevue/button";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";

import { ContattoRequest } from "../../dto/ContattoRequest.js";
import { aggiungiContattoDipendente } from "../../services/UserService.js";

const props = defineProps(["contatti"]);

const confirm = useConfirm();

const loadingDialog = ref(false);
const feedbackPositivoDialog = ref(false);
const feedbackNegativoDialog = ref(false);

const contatto = ref("");
const contattoNonValido = ref();

const selectedTipoContatto = ref(null);
const tipiContatto = ref([
    { name: "Cellulare", code: "cell" },
    { name: "Email", code: "email" },
    { name: "Facebook", code: "fb" },
    { name: "Instagram", code: "ins" },
    { name: "Telegram", code: "tel" },
]);
const tipoContattoNonValido = ref(false);

// Stato per il controllo degli errori
const errori = reactive({
    tipoContatto: { invalid: false, messaggio: "" },
    contatto: { invalid: false, messaggio: "" },
});

const contacts = ref([]);

onMounted(() => {

    contacts.value = props.contatti;
})

const addContact = async () => {

    const contattoRequest = new ContattoRequest(
        selectedTipoContatto.value.name,
        contatto.value
    );

    if (isInputError())
        return;

    if (isAlreadyExists()) {

        askConfirm(contattoRequest);
        return;
    }

    salvaNuovoContatto(contattoRequest);

    aggiungiContattoAllElenco();

    resetInputField();

};

const resetInputField = () => {

    selectedTipoContatto.value = null;
    contatto.value = "";
}

const salvaNuovoContatto = async (contattoRequest) => {

    try {
        loadingDialog.value = true;
        const response = await aggiungiContattoDipendente(contattoRequest);
        loadingDialog.value = false;
        feedbackPositivoDialog.value = true;
    } catch (error) {
        console.error("Errore durante l'aggiunta del contatto:", error);
        loadingDialog.value = false;
        feedbackNegativoDialog.value = true;
    }
}

const isInputError = () => {

    if (selectedTipoContatto.value === null) {

        errori.tipoContatto.invalid = true;
        errori.tipoContatto.messaggio = "Seleziona un tipo di contatto";
        return true;
    }

    if (selectedTipoContatto.value.name === "Cellulare") {

        const contattoTrim = contatto.value.trim();
        if (!/^(?:\+39)?[0-9]{10}$/.test(contattoTrim)) {

            errori.contatto.invalid = true;
            errori.contatto.messaggio = "Inserisci un numero di cellulare valido (10 cifre, prefisso +39 opzionale)";
            return true;
        }

    }

    if (selectedTipoContatto.value.name === "Email") {

        const contattoTrim = contatto.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contattoTrim)) {

            errori.contatto.invalid = true;
            errori.contatto.messaggio = "Inserisci un indirizzo email valido";
            return true;
        }
    }

    return false;
}

const isAlreadyExists = () => {

    let contattoEsistente = false;

    contacts.value.forEach(contact => {

        if (contact["tipo"] === selectedTipoContatto.value.name) {
            contattoEsistente = true;

        }
    });

    return contattoEsistente;
};

const resetErrori = () => {

    errori.tipoContatto.invalid = false;
    errori.tipoContatto.messaggio = "";

    errori.contatto.invalid = false;
    errori.contatto.messaggio = "";
}

const askConfirm = async (contattoRequest) => {
    
    confirm.require({
        message: 'Esiste già questo tipo di contatto, vuoi modificarlo?',
        header: 'Conferma',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Annulla',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Si, modifica'
        },
        accept: () => {
            modificaValoreContatto(contattoRequest);
        },
        reject: () => {
            console.log("Modifica annullata");
        }
    });
};


const modificaValoreContatto = (contattoRequest) => {

    salvaNuovoContatto(contattoRequest);
    modificaContattoNellElenco();

};

const aggiungiContattoAllElenco = () => {

    contacts.value.push({
        "tipo": selectedTipoContatto.value.name,
        "valore": contatto.value
    });
}

const modificaContattoNellElenco = () => {

    contacts.value.forEach(contact => {

        if (contact["tipo"] === selectedTipoContatto.value.name) {
            contact["valore"] = contatto.value;

        }
    })
}

</script>