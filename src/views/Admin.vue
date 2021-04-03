<template>
  <socket-manager />
  <div v-if="!isLoggedIn">
    <p>Bienvenue sur la page d'administration!</p>
    <p>Veuillez vous connecter pour continuer:</p>
    <p style="color: red">
      <b>{{ adminLoginErrorMessage }}</b>
    </p>
    <input
      v-model="adminPasswordInput"
      @input="adminLoginErrorMessage = ''"
      @keyup.enter="adminLogin"
      type="password"
    />
  </div>

  <!-- Admin dashboard -->
  <div v-else>
    <p>Logs :
      <ul>
        <li v-for="log in logs"><b>Team: {{ log.teamName }}</b> -> {{ JSON.stringify(log.vote) }}</li>
      </ul>
    </p>
    <p>
      <label>Intitulé: <input type="text" v-model="title" maxlength="500" /></label>
    </p>
    <p>
      <label>Timer (en secondes): <input type="number" v-model.number="timer" /></label>
    </p>
    <p>
      <label>Points: <input type="number" v-model.number="points" /></label>
    </p>
    <p>
      <label>
        Est-ce que tout le monde gagne le(s) point(s) ? (Sinon, seul le 1er à répondre le(s) gagne):
        <input type="checkbox" v-model="everyoneGetsPoints" />
      </label>
    </p>
    <p>
      Type de question : <b>{{ selectedQuestionType }}</b>
    </p>
    <select v-model="selectedQuestionType">
      <option disabled value="">Veuillez sélectionner un type</option>
      <option>MultipleChoice</option>
      <option>SingleChoice</option>
      <option>Textual</option>
      <option>TrueFalse</option>
    </select>

    <div v-if="selectedQuestionType == 'MultipleChoice'">
      <p>
        <input type="checkbox" v-model="multipleChoiceCheckboxes" value="0" />
        <input v-model="multipleChoiceAnswer1" type="text" />
      </p>
      <p>
        <input type="checkbox" v-model="multipleChoiceCheckboxes" value="1" />
        <input v-model="multipleChoiceAnswer2" type="text" />
      </p>
      <p>
        <input type="checkbox" v-model="multipleChoiceCheckboxes" value="2" />
        <input v-model="multipleChoiceAnswer3" type="text" />
      </p>
      <p>
        <input type="checkbox" v-model="multipleChoiceCheckboxes" value="3" />
        <input v-model="multipleChoiceAnswer4" type="text" />
      </p>
      <p><button @click="sendMultipleChoiceQuestion">Envoyer !</button></p>
    </div>

    <div v-else-if="selectedQuestionType == 'SingleChoice'"></div>

    <div v-else-if="selectedQuestionType == 'Textual'">
      <p>
        <label>
          Réponse attendue (case insensitive) :
          <input type="text" v-model.trim="textualAnswer" />
        </label>
      </p>
      <p><button @click="sendTextual">Envoyer !</button></p>
    </div>

    <div v-else-if="selectedQuestionType == 'TrueFalse'"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import SocketManager from "../components/SocketInfos.vue";
// Import the socket connection from the main as the composition API
// is not yet supported by vue-socket.io-extended
import { socket } from "../main";
import {
  TextualQuestion,
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
} from "../../server/types/questions";

export default defineComponent({
  name: "Admin",
  components: {
    SocketManager,
  },

  sockets: {
    connect() {
      this.isLoggedIn = false;
    },

    adminLogin(isPasswordCorrect: EventResponse<Team>) {
      this.adminPasswordInput = "";
      if (isPasswordCorrect) this.isLoggedIn = true;
      else this.adminLoginErrorMessage = "Le mot de passe est incorrect!";
    },
    
    vote(data: any) {
      this.logs.push({
        teamName: data.team.name,
        vote: data.vote
      });
    }
  },

  setup: (props, ctx) => {
    let isLoggedIn = ref(false);

    let adminPasswordInput = ref(""),
      adminLoginErrorMessage = ref("");
    let adminLogin = () =>
      adminPasswordInput.value && socket.emit("adminLogin", adminPasswordInput.value);

    let selectedQuestionType = ref("");

    // New question
    /// Global properties
    let title = ref("");
    let timer = ref(20); // in sec
    let points = ref(1);
    let everyoneGetsPoints = ref(false);

    // Multiple choice
    let multipleChoiceCheckboxes = ref<string[]>([]);
    let multipleChoiceAnswer1 = ref("");
    let multipleChoiceAnswer2 = ref("");
    let multipleChoiceAnswer3 = ref("");
    let multipleChoiceAnswer4 = ref("");
    let sendMultipleChoiceQuestion = () => {
      socket.emit(
        "question",
        new MultipleChoiceQuestion(
          title.value,
          timer.value,
          points.value,
          everyoneGetsPoints.value,
          [
            multipleChoiceAnswer1.value,
            multipleChoiceAnswer2.value,
            multipleChoiceAnswer3.value,
            multipleChoiceAnswer4.value,
          ],
          multipleChoiceCheckboxes.value.map((str) => parseInt(str))
        )
      );
    };

    // Textual
    let textualAnswer = ref("");
    let sendTextual = () => {
      socket.emit(
        "question",
        new TextualQuestion(
          title.value,
          timer.value,
          points.value,
          everyoneGetsPoints.value,
          textualAnswer.value.toLowerCase()
        )
      );
    };
    
    interface Log {
      teamName: string,
      vote: any,
    };
    let logs = ref<Log[]>([]);

    return {
      isLoggedIn,

      adminPasswordInput,
      adminLoginErrorMessage,
      adminLogin,

      title,
      timer,
      points,
      everyoneGetsPoints,

      selectedQuestionType,

      multipleChoiceCheckboxes,
      multipleChoiceAnswer1,
      multipleChoiceAnswer2,
      multipleChoiceAnswer3,
      multipleChoiceAnswer4,
      sendMultipleChoiceQuestion,

      textualAnswer,
      sendTextual,
      
      logs
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
