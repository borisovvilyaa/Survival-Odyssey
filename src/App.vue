<template>
  <div id="app">
    <AppNavigation />
    <div class="container-main">
      <div class="container">
        <router-view />
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppNavigation from "@/components/AppNavigation.vue";
import AppFooter from "@/components/AppFooter.vue";

export default {
  components: {
    AppNavigation,
    AppFooter,
  },
};
</script>

<style>
@import url(./assets/scss/main.scss);

body {
  background: url("./assets/background.jpg");
  background-size: cover;
  background-attachment: fixed;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container-main {
  flex: 1;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Additional styles to ensure the footer is at the bottom */
footer {
  margin-top: auto;
}
</style>
