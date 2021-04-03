<template>
  <link rel="stylesheet" href="assets/style.css" />
  <link href="assets/bootstrap.css" rel="stylesheet" />
  <ul>
    <li><router-link to="/">Home page</router-link></li>
    <li><router-link to="/admin">Admin page</router-link></li>
  </ul>
  <main class="form-play">
    <h1 class="h3 mb-3 fw-normal">Quiz pour un viking</h1>
    <router-view></router-view>
    <p class="mt-5 mb-3 text-muted">© Valhall'art - Liste BDA - Ensimag 2021</p>
  </main>
  <div id="particles-js">
    <canvas class="particles-js-canvas-el" style="width: 100%; height: 100%"></canvas>
  </div>
  <!-- <script src="assets/"></script>
  <script src="assets/"></script>
  <script src="assets/"></script>
  <script src="assets/"></script>
  <script src="assets/"></script> -->
</template>

<script lang="ts">
// import "./assets/jquery-3.js";
// import "./assets/popper.js";
// import "./assets/bootstrap.js";
// import "./assets/particles.js";
// import "./assets/script.js";

import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "App",
  components: {},

  setup: (props, ctx) => {
    return {};
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
