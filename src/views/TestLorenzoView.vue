<template>
  <div  class="flex flex-col">
    <h2>User Profile</h2>
    <Button @click="login">
      Login
    </Button>
    <Button @click="getToken">
      Get Access Token
    </Button>
    <pre v-if="isAuthenticated">
      <code>{{ user }}</code>
    </pre>
    <pre v-if="accessToken" class="flex flex-col">
      
      <code>{{ accessToken }}</code>
    </pre>
  </div>
</template>

<script setup>
  import { useAuth0 } from '@auth0/auth0-vue';
  import { ref } from 'vue';
  import Button from 'primevue/button'

  const { loginWithPopup, user, isAuthenticated, getAccessTokenSilently,getAccessTokenWithPopup } = useAuth0();
  const accessToken = ref('');
const tok = ref('')

  const login = () => {
    loginWithPopup();
  };

  const getToken = async () => {
    try {
      accessToken.value = await getAccessTokenSilently();
    
      console.log('Access token:', accessToken);
      if (isAuthenticated.value) {
        console.log('Email:', user.value.email);
      }
    } catch (error) {
      console.error('Error getting access token:', error);
    }
  };
</script>