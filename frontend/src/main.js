import { createApp } from "vue";
import App from "./App.vue";

import router from "./services/router";
import store from "./services/store";
import "./index.css";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

createApp(App).use(router).use(VueSweetalert2).use(store).mount("#app");
