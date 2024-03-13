import { createApp } from "vue";
import { createPinia } from "pinia";
import { Icon } from "@iconify/vue";

import App from "./App.vue";
import router from "./router";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import "./assets/less/main.less";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueSweetalert2);
app.component("IconifyIcon", Icon);

app.mount("#app");
