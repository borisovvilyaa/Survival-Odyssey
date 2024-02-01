import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// Import jQuery and Popper.js
import "jquery/dist/jquery";
// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

// Import Bootstrap scripts
import "bootstrap/dist/js/bootstrap.bundle.min.js";

createApp(App).use(router).mount("#app");
