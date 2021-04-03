<template>
  <img alt="Logo Valhall'art" width="300" src="../assets/logo.svg" />
  <socket-manager />
  <div v-if="hasJoinedTeam">
    <p>Tu es actuellement dans l'équipe <b>{{ team.name }}</b> !</p>
    <p>Demande à tes amis de te rejoindre en utilisant le code <b>{{ team.id }}</b> !</p>
    <p>Il y a actuellement {{ team.personCount }}/4 personnes dans ton équipe!</p>
    <question-frame />
  </div>
  <p v-else>
    <h2>On dirait que vous n'êtes pas encore dans une équipe... réglons ça !</h2>
    <div>
      <h3>1 - Rejoindre une équipe</h3>
      <p style="color: red"><b>{{ teamJoiningErrorMessage }}</b></p>
      <input v-model="teamIDInput" @input="teamJoiningErrorMessage = ''" @keyup.enter="joinTeam" type="text" maxlength="4">
      <button @click="joinTeam">Join!</button>
    </div>
    
    <div>
      <h3>2 - Créer une équipe</h3>
      <p style="color: red"><b>{{ teamCreationErrorMessage }}</b></p>
      <input v-model.trim="teamNameInput" @input="teamCreationErrorMessage = ''" @keyup.enter="createTeam" type="text" maxlength="20">
      <button @click="createTeam">Créer l'équipe !</button>
    </div>
  </p>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import SocketManager from "../components/SocketInfos.vue";
import QuestionFrame from "../components/QuestionFrame.vue";
// Import the socket connection from the main as the composition API
// is not yet supported by vue-socket.io-extended
import { socket } from "../main";

export default defineComponent({
  name: "Home",
  components: {
    SocketManager,
    QuestionFrame
  },
  
  
  sockets: {
    connect() {
      this.hasJoinedTeam = false;
      this.teamJoiningErrorMessage = "";
      this.teamCreationErrorMessage = "";
    },
    
    teamCreated(res: EventResponse<Team>) {
      this.teamNameInput = "";
      if (res.error) {
        this.teamCreationErrorMessage = res.error;
        return;
      }
      
      this.team = res.data!;
      this.hasJoinedTeam = true;
    },
    
    teamJoined(res: EventResponse<Team>) {
      this.teamIDInput = "";
      if (res.error) {
        this.teamJoiningErrorMessage = res.error;
        return;
      }
      
      this.team = res.data!;
      this.hasJoinedTeam = true;
    },
    
    teamPersonCountUpdate(newPersonCount: number) {
      // Safety check, should always be true anyway
      if (this.hasJoinedTeam)
        this.team.personCount = newPersonCount;
    }
  },

  setup: (props, ctx) => {
    let hasJoinedTeam = ref(false);
    
    let team = ref(<Team>{});
    
    // Team creation
    let teamNameInput = ref(""), teamCreationErrorMessage = ref("");
    let createTeam = () => {
      if (teamNameInput.value) {
        if (teamNameInput.value.length >= 2 && teamNameInput.value.length <= 20)
          socket.emit("createTeam", teamNameInput.value);
        else
          teamCreationErrorMessage.value = "Le nom d'équipe doit faire entre 2 et 20 caractères :)"
      }
      
    };
    
    // Team joining
    let teamIDInput = ref(""), teamJoiningErrorMessage = ref("");
    let joinTeam = () => {
      if (teamIDInput.value.length == 4)
        socket.emit("joinTeam", teamIDInput.value)
      else
        teamJoiningErrorMessage.value = "L'ID doit faire 4 caractères :)";
    };

    return {
      hasJoinedTeam,
      team,
      
      // Team creation
      teamNameInput,
      teamCreationErrorMessage,
      createTeam,
      
      // Team joining
      teamIDInput,
      teamJoiningErrorMessage,
      joinTeam
    };
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
