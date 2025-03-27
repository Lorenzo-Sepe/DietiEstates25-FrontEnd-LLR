<template>
  <Login @close="closeDialog"/>

    <div class="mt-2 flex flex-col justify-center bg-gray-100 items-center">
        <Auth0Login @close="closeDialog"/>
    </div>
</template>

<script setup>
import Login from '../Logins/Login.vue'; 
import Auth0Login from '../Logins/Auth0Login.vue';

</script>