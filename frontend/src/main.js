import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from 'pinia'
import vuetify from "./plugins/vuetify";
import Toast from 'vue-toastification';
import router from "./router";
import "@/plugins/socket";
import "@/plugins/axios";
import 'vue-toastification/dist/index.css';
import './assets/scss/main.scss'

const app = createApp(App);
const pinia = createPinia()

app.config.globalProperties.$socket = socket;

app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(Toast);
app.mount("#app");
