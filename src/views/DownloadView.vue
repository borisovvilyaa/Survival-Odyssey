<template>
  <div class="mt-5">
    <div class="text-center main-header">
      <h1 class="fw-bold">Survival Odyssey</h1>
      <p>
        A mobile survival game where the main goal of the player is to survive
      </p>
    </div>
    <hr />
    <div class="text-center mt-5 mb-5">
      <button class="btn btn-primary fs-1 fw-bload" @click="downloadGame">
        Download Now
      </button>
    </div>
    <div class="main-container mt-5">
      <h3 class="fw-bold fs-1 text-center">Game Overview</h3>
      <div
        class="d-flex gap-5 align-items-center justify-content-center main-about mt-5"
      >
        <img src="../assets/Download/gap1.jpg" alt="" />
        <div>
          <h3>This captivating project is more than just a game</h3>
          <p>
            It's a tale of survival, a journey through dangerous yet captivating
            lands filled with mysteries and opportunities. We aspire to create
            something unique - a world where your survival depends on your wit,
            skills, and strategy
          </p>
        </div>
      </div>
      <div
        class="d-flex gap-5 align-items-center justify-content-center main-about mt-5"
      >
        <div>
          <h3>We've implemented numerous new mechanics, such as:</h3>
          <ul>
            <li>Character control 🕹</li>
            <li>Inventory and crafting system 🔧</li>
            <li>Character dressing 👕</li>
            <li>Health, hunger, and thirst indicators ❤️🍔💧</li>
            <li>Basic AI for animals 🐾</li>
            <li>Building system 🏗</li>
            <li>Resource gathering (wood and stone) 🌳🪵</li>
            <li>Item picking up mechanics 🛠</li>
            <li>Multiplayer functionality! 🌐</li>
          </ul>
        </div>
        <img src="../assets/Download/gap2.jpg" alt="" />
      </div>
    </div>
    <div class="main-media mt-5">
      <h3 class="fw-bold fs-1 text-center">Media</h3>

      <div class="gallery mt-5">
        <div
          v-for="(image, index) in galleryImages"
          :key="index"
          class="gallery-item"
          @click="openLightbox(index)"
        >
          <img
            :src="image.src"
            :alt="'Survival Odyssey Screenshot ' + (index + 1)"
          />
        </div>
      </div>

      <!-- Lightbox container -->
      <div
        v-if="lightboxOpen"
        class="lightbox-container"
        @click="closeLightbox"
      >
        <div class="lightbox-content">
          <img
            :src="galleryImages[lightboxIndex].src"
            :alt="'Survival Odyssey Screenshot ' + (lightboxIndex + 1)"
          />
        </div>
      </div>
    </div>
    <div class="main-about-specs mt-5">
      <h3 class="fw-bold">Survival Odyssey</h3>
      <p>
        A mobile survival game where the main goal of the player is to survive
      </p>
      <div class="d-flex justify-content-center spec">
        <p class="me-3"><strong>Release Date:</strong> January 31, 2024</p>
        <p class="me-3"><strong>Genre:</strong> Survival</p>
        <p class="me-3"><strong>Platform:</strong> Android</p>
        <div>
          <p><strong>Specifications:</strong></p>
          <ul>
            <li><strong>RAM:</strong> 2 GB</li>
            <li><strong>Storage:</strong> 2 GB</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="text-center mt-5 mb-5">
      <button class="btn btn-primary fs-1 fw-bload" @click="downloadGame">
        Download Now
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      galleryImages: [
        {
          src: "img/gap2.7fafc017.jpg",
        },
        {
          src: "img/gap2.7fafc017.jpg",
        },
        {
          src: "img/gap2.7fafc017.jpg",
        },
        {
          src: "img/gap2.7fafc017.jpg",
        },
        {
          src: "img/gap2.7fafc017.jpg",
        },
        {
          src: "img/gap2.7fafc017.jpg",
        },
      ],
      lightboxOpen: false,
      lightboxIndex: 0,
    };
  },
  methods: {
    openLightbox(index) {
      this.lightboxOpen = true;
      this.lightboxIndex = index;
    },
    closeLightbox() {
      this.lightboxOpen = false;
      this.lightboxIndex = 0;
    },
    downloadGame() {
      console.log("Download");
    },
  },
};
</script>

<style lang="scss">
.download {
  position: fixed;
  width: 100%;
  background-color: #e7e7e7;
  margin: 0;
  padding: 0;
}

.main-header {
  h1 {
    font-size: 72px;
  }
}

.main-about-specs {
  text-align: center;
  li {
    list-style: none;
    text-align: left;
  }
  h3 {
    font-size: 72px;
  }
  p {
    font-size: 1.125rem;
  }
  strong {
    color: #e7e7e7;
  }
}

.main-about {
  h3 {
    font-size: 24px;
  }
  p {
    font-size: 18px;
  }
  img {
    width: 100%; /* Make the image responsive within its container */
    height: auto;
    border-radius: 20px;
    -webkit-box-shadow: 0px 17px 38px 17px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: 0px 17px 38px 17px rgba(0, 0, 0, 0.4);
    box-shadow: 0px 17px 38px 17px rgba(0, 0, 0, 0.4);
  }
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px; /* Adjust the gap for smaller screens */
}

.lightbox-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.gallery-item img {
  max-width: 300px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
}

/* Media Queries for smaller screens */
@media (max-width: 768px) {
  .main-about,
  .spec {
    flex-direction: column;
    gap: 10px; /* Adjust the gap for smaller screens */
  }
  .spec {
    li {
      margin-left: -30px;
      text-align: center;
    }
  }
}
</style>
