<template>
  <p v-if="question === null">Pas de question pour le moment...</p>
  <div v-else>
    <h1>{{ question.title }}</h1>
    <h3>
      Temps restant : <b>{{ Math.ceil(question.timer) }} sec</b>
    </h3>
    <h3>
      Cette question rapporte <b>{{ question.points }}</b> points
    </h3>
    <p>
      <i
        >Cette question rapporte des points
        {{ question.everyoneGetsPoints ? "à tout le monde" : "au 1er qui répond" }}</i
      >
    </p>

    <MultipleChoiceQuestion
      v-if="question.type == 'multipleChoice'"
      :question="question"
      @vote="vote"
    />
    <SingleChoiceQuestion
      v-else-if="question.type == 'singleChoice'"
      :question="question"
      @vote="vote"
    />
    <TextualQuestion v-else-if="question.type == 'textual'" :question="question" @vote="vote" />
    <TrueFalseQuestion v-else-if="question.type == 'trueFalse'" :question="question" @vote="vote" />
  </div>
</template>

<script lang="ts">
import { ref, Ref, defineComponent } from "vue";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion.vue";
import SingleChoiceQuestion from "./questions/SingleChoiceQuestion.vue";
import TextualQuestion from "./questions/TextualQuestion.vue";
import TrueFalseQuestion from "./questions/TrueFalseQuestion.vue";
import { Question } from "../../server/types/questions";
import { socket } from "../main";

export default defineComponent({
  name: "QuestionFrame",
  components: {
    MultipleChoiceQuestion,
    SingleChoiceQuestion,
    TextualQuestion,
    TrueFalseQuestion,
  },
  props: {},
  sockets: {
    question(question: Question) {
      this.question = question;
    },
  },
  setup: () => {
    let question: Ref<Question | null> = ref(null);
    let vote = (data: any) => {
      socket.emit("vote", data);
    };

    return {
      question,
      vote,
    };
  },
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
