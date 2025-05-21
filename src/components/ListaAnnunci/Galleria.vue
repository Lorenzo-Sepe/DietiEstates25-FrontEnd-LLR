<template>
  <div class="contenitore-foto w-full h-full relative">
    <!-- Immagine -->
    <img
      :src="props.immagini[currentImageIndex].url"
      alt="Immagine"
      class="w-full h-full rounded-lg"
    />

    <!-- Freccia sinistra -->
    <button
      class="absolute top-1/2 left-4 transform -translate-y-1/2 bg-[rgba(0,0,0,0.15)] hover:bg-[rgba(0,0,0,0.3)] cursor-pointer p-2 rounded-full hover:bg-opacity-75 z-10"
      @click="prevImage"
    >
      <img
        src="../../assets/Icon/left-arrow.png"
        alt="Freccia"
        class="w-5 h-5 inline"
      />
    </button>

    <!-- Freccia destra -->
    <button
      class="absolute top-1/2 right-4 transform -translate-y-1/2 bg-[rgba(0,0,0,0.15)] hover:bg-[rgba(0,0,0,0.3)] cursor-pointer p-2 rounded-full hover:bg-opacity-75 z-10"
      @click="nextImage"
    >
      <img
        src="../../assets/Icon/right-arrow.png"
        alt="Freccia"
        class="w-5 h-5 inline"
      />
    </button>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";

const props = defineProps(["immagini"]);

const currentImageIndex = ref(0);

const nextImage = () => {
  if (currentImageIndex.value < props.immagini.length - 1) {
    currentImageIndex.value++;
  } else {
    currentImageIndex.value = 0;
  }
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  } else {
    currentImageIndex.value = props.immagini.length - 1;
  }
};
</script>
