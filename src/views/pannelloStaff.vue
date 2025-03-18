<template>
    <div class="flex flex-col gap-4">
        <AreaSuperiore />
        <TabellaAnnunci />
        <Paginator />
    </div>
</template>

<script setup>

import AreaSuperiore from '../components/PannelloStaff/AreaSuperiore.vue'
import TabellaAnnunci from '../components/PannelloStaff/tabellaAnnunci.vue'
import Paginator from '../components/PannelloStaff/Paginator.vue';

</script>