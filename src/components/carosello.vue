<template>
  <div>
    <div
      id="carouselExample"
      class="carousel slide"
      data-ride="carousel"
      data-interval="false"
    >
      <div class="carousel-inner">
        <div
          class="carousel-item"
          v-for="(item, index) in galleria"
          :key="index"
          :class="{ active: index === 0 }"
        >
          <img
            :src="item.url"
            class="d-block w-100"
            alt="..."
            @click="openModal(item.url, item.descrizione)"
          />
          <div class="carousel-caption d-none d-md-block caption-bg">
            <h5>{{ item.descrizione }}</h5>
          </div>
        </div>
      </div>
      <a
        class="carousel-control-prev"
        href="#carouselExample"
        role="button"
        data-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a
        class="carousel-control-next"
        href="#carouselExample"
        role="button"
        data-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>

    <!-- Modal per l'immagine a schermo intero -->
    <div
      class="modal fade"
      id="imageModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="imageModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="imageModalLabel">{{ description }}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body p-0">
            <img
              :src="selectedImage"
              class="img-fluid"
              alt="Immagine a schermo intero"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const selectedImage = ref("");
const description = ref("");

defineProps({
  galleria: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(
        (item) =>
          typeof item.url === "string" && typeof item.descrizione === "string",
      );
    },
  },
});

const openModal = (imageUrl, imageDescription) => {
  selectedImage.value = imageUrl;
  description.value = imageDescription;
  $("#imageModal").modal("show");
};

// Includi Bootstrap JS
onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://code.jquery.com/jquery-3.5.1.slim.min.js";
  script.onload = () => {
    const popper = document.createElement("script");
    popper.src =
      "https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js";
    popper.onload = () => {
      const bootstrap = document.createElement("script");
      bootstrap.src =
        "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js";
      document.body.appendChild(bootstrap);
    };
    document.body.appendChild(popper);
  };
  document.body.appendChild(script);
});
</script>

<style>
@import url("https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css");

.carousel-item {
  height: 400px;
  background-color: black;
  cursor: pointer;
}

.carousel-item img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.caption-bg {
  background-color: rgba(0, 0, 0, 0.7);
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
