import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { createStore } from "vuex";
import VueSocketIOExt from "vue-socket.io-extended";
import { io } from "socket.io-client";

import App from "./App.vue";
import Home from "./views/Home.vue";
import Admin from "./views/Admin.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/admin", component: Admin },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const store = createStore({
  state() {
    return {};
  },
  mutations: {},
});

export const socket = io("https://quiz.valhallart.eu/", {
  path: "/quiz/socket.io",
});

createApp(App).use(router).use(store).use(VueSocketIOExt, socket).mount("#app");
