<template>
    <div id="carouselExample" class="carousel slide" data-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item" v-for="(item, index) in items" :key="index" :class="{ active: index === 0 }">
          <img :src="item.image" class="d-block w-100" alt="...">
          <div class="carousel-caption d-none d-md-block caption-bg">
            <h5>{{ item.caption }}</h5>
          </div>
        </div>
      </div>
      <a class="carousel-control-prev" href="#carouselExample" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carouselExample" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

const items = [
    {
        image: 'https://placehold.co/600x400/EEE/31343C',
        caption: 'Prima didascalia'
    },
    {
        image: 'https://placehold.co/600x400/EEE/31343C',
        caption: 'Seconda didascalia'
    },
    {
        image: 'https://placehold.co/600x400/EEE/31343C',
        caption: 'Terza didascalia'
    }
];

// Includi Bootstrap JS
onMounted(() => {
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.5.1.slim.min.js';
    script.onload = () => {
        const popper = document.createElement('script');
        popper.src = 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js';
        popper.onload = () => {
            const bootstrap = document.createElement('script');
            bootstrap.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js';
            document.body.appendChild(bootstrap);
        };
        document.body.appendChild(popper);
    };
    document.body.appendChild(script);
});
</script>

<style>
@import url('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');

.carousel-item img {
    max-height: 400px; /* Imposta l'altezza massima per le immagini */
}

.caption-bg {
    background-color: rgba(0, 0, 0, 0.7); /* Sfondo nero con trasparenza */
    padding: 10px; /* Padding per la caption */
    border-radius: 5px; /* Angoli arrotondati */
}

.carousel-caption h5 {
    color: white; /* Colore del testo */
}
</style>