<template>

    <div class="contenitore-area-superiore">
        <div class="contenitore-foto-profilo flex items-center gap-4">
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" size="xlarge"
                shape="circle" />
            <div class="info-profilo flex flex-col">
                <p>Nome Cognome</p>
                <p>Nome agenzia</p>
            </div>
        </div>
        <div class="titolo-pagina">
            <h1>Gestione annunci immobiliari</h1>
        </div>
    </div>

</template>

<script setup>
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
</script>

<style scoped>
.contenitore-area-superiore {

    display: flex;
    flex-direction: row;
    gap: 6rem;
    padding: 1rem;
}
</style>