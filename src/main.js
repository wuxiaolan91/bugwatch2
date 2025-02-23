import "./assets/main.css";
elementPlus;
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import elementPlus from "element-plus";
const app = createApp(App);
app.use(elementPlus);
app.use(router);

app.mount("#app");
