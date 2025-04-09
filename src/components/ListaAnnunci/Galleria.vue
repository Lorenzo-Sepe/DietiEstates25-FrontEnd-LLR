<template>
    <div class="w-full h-full">
        <div id="carouselExample" class="carousel slide w-full h-full" data-ride="carousel" data-interval="false">
            <div class="carousel-inner w-full h-full">  
                <div class="carousel-item" v-for="(item, index) in galleria" :key="index"
                    :class="{ active: index === 0 }">
                    <img :src="item.url" class="w-full h-full border border-gray-200 rounded-md" alt="...">
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
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    galleria: {
        type: Array,
        required: true,
        validator: (value) => {
            return value.every(item =>
                typeof item.url === 'string' &&
                typeof item.descrizione === 'string'
            );
        }
    }
});

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

.carousel-item {
    height: 100%;
    cursor: pointer;
}

.carousel-item img {
    height: 100%;
    width: 100%;
    object-fit: cover;
}

.caption-bg {
    padding: 10px;
    border-radius: 5px;
}

.carousel-caption h5 {
    color: white;
}

.modal-body {
    max-height: 80vh;
    overflow: hidden;
}

.modal-body img {
    width: 100%;
    height: auto;
    object-fit: contain;
}
</style>