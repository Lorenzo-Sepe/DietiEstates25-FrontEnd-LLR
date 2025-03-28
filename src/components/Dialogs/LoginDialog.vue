<template>
  <Login @close="closeDialog" class="rounded"/>

    <div class="mt-2 flex flex-col justify-center rounded bg-gray-100 items-center">
        <Auth0Login @close="closeDialog"/>
    </div>
</template>

<script setup>
import Login from '../Logins/Login.vue'; 
import Auth0Login from '../Logins/Auth0Login.vue';

</script>