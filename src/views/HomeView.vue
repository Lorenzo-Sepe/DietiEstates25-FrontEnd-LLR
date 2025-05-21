<template>
  <div class="home_image-container">
    <img src="/src/assets/copertina_home.png" alt="home" class="home_image" />

    <div class="home_ricerca">
      <AreaRicerca />
      <span
        class="text-lg font-semibold text-primary-600 hover:primary-blue-800 underline decoration-2 transition duration-200 ease-in-out cursor-pointer"
        @click="vaiAllaMappa"
      >
        Oppure clicca qui per disegnare la tua zona di interesse
      </span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

import AreaRicerca from "../components/Homepage/AreaRicerca.vue";

const router = useRouter();

const vaiAllaMappa = () => {
  router.push({
    path: "/mappa-annunci",
    query: { immobile: "APPARTAMENTO", contratto: "AFFITTO" },
  });
};
</script>

<style scoped>
.home_image-container {
  position: relative;
  width: 90%;
  margin: 2rem;
}

.home_image-container .home_image {
  display: block;
  width: 100%;
  height: auto;
}

@media (max-width: 768px) {
  .home_image-container {
    width: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .home_image-container .home_image {
    position: static;
    width: 80%;
  }

  .home_ricerca {
    position: static;
    transform: none;
    width: 90%;
    margin-top: 1rem;
  }
}

.home_ricerca {
  width: 90%;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: flex-center;
  gap: 1rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .home_ricerca {
    width: 100%;
    padding: 2rem;
    height: auto;
    position: static;
    transform: none;
    background-color: #e5e7eb;
  }

  .home_ricerca .flex {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
