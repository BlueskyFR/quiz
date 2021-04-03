<template>
  <h1>
    <b>{{ $socket.connected ? "✅ connecté au serveur" : "❌ déconnecté du serveur" }}</b>
  </h1>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";

export default defineComponent({
  name: "SocketInfos",
  props: {},
  sockets: {
    connect() {
      console.log("Successfully connected to the server!");
    },
  },
  setup: () => {},
});
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
