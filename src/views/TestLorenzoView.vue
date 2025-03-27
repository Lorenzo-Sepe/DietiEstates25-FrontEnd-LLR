<template>
  <div>
    <h2>User Profile</h2>
    <button @click="login">
      login
    </button>
    <button @click="getAccessToken">
      Get Access Token
    </button>
    <pre v-if="isAuthenticated">
      <code>{{ user }}</code>
    </pre>
    <pre v-if="accessToken">
      <code>{{ accessToken }}</code>
    </pre>
  </div>
</template>

<script setup>
  import { useAuth0 } from '@auth0/auth0-vue';
  import { ref } from 'vue';

  const { loginWithPopup, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const accessToken = ref('');

  const login = () => {
    loginWithPopup();
  };

  const getAccessToken = async () => {
    try {
      accessToken.value = await getAccessTokenSilently();
    } catch (error) {
      console.error('Error getting access token:', error);
    }
  };
</script>